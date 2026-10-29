import mongoose from 'mongoose';
import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';
function validQty(q){return Number.isInteger(q)&&q>0;}
async function transact(req,res,type){
 const {productId,quantity,reason,notes=''}=req.body||{};
 if(!productId)return res.status(400).json({message:'Select a product.'});
 if(!validQty(quantity))return res.status(400).json({message:'Transaction quantity must be a positive whole number.'});
 if(!reason||!String(reason).trim())return res.status(400).json({message:'Choose a transaction reason.'});
 const session=await mongoose.startSession();
 try {
   let result;
   // Use MongoDB transaction when the deployment supports it; fallback to guarded atomic update for standalone local MongoDB.
   try {
     await session.withTransaction(async()=>{
       const p=await Product.findById(productId).session(session);if(!p)throw Object.assign(new Error('Product not found.'),{status:404});
       const previousQuantity=p.quantity;const newQuantity=type==='IN'?previousQuantity+quantity:previousQuantity-quantity;
       if(newQuantity<0)throw Object.assign(new Error(`Not enough stock. Available quantity: ${previousQuantity}.`),{status:400});
       p.quantity=newQuantity;await p.save({session});
       const [movement]=await StockMovement.create([{product:p._id,productId:p.productId,productName:p.name,type,quantity,reason:String(reason).trim(),notes,previousQuantity,newQuantity}],{session});result={product:p,movement};
     });
   } catch(e) {
     if(!/Transaction numbers are only allowed|replica set|does not support transactions|IllegalOperation/i.test(e.message))throw e;
     // Safe single-document atomic update followed by history insert; roll back quantity if history insert fails.
     const p=await Product.findById(productId);if(!p)throw Object.assign(new Error('Product not found.'),{status:404});
     const previousQuantity=p.quantity,newQuantity=type==='IN'?previousQuantity+quantity:previousQuantity-quantity;
     if(newQuantity<0)throw Object.assign(new Error(`Not enough stock. Available quantity: ${previousQuantity}.`),{status:400});
     const condition={_id:p._id,quantity:previousQuantity};const updated=await Product.findOneAndUpdate(condition,{$set:{quantity:newQuantity}},{new:true});
     if(!updated)throw Object.assign(new Error('Stock changed during this request. Please try again.'),{status:409});
     try {const movement=await StockMovement.create({product:p._id,productId:p.productId,productName:p.name,type,quantity,reason:String(reason).trim(),notes,previousQuantity,newQuantity});result={product:updated,movement};}
     catch(err){await Product.updateOne({_id:p._id,quantity:newQuantity},{$set:{quantity:previousQuantity}});throw err;}
   }
   res.status(201).json({message:`Stock ${type==='IN'?'added':'removed'} successfully.`,...result});
 } finally {await session.endSession();}
}
export const stockIn=(req,res)=>transact(req,res,'IN'); export const stockOut=(req,res)=>transact(req,res,'OUT');
export async function listMovements(req,res){const {search='',type='',from='',to=''}=req.query;const f={};if(type)f.type=type;if(from||to)f.createdAt={...(from?{$gte:new Date(from)}:{}),...(to?{$lte:new Date(`${to}T23:59:59.999`)}:{})};if(search.trim()){const escaped=search.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&');f.$or=[{productName:{$regex:escaped,$options:'i'}},{productId:{$regex:escaped,$options:'i'}}];}const items=await StockMovement.find(f).sort({createdAt:-1}).limit(1000).lean();res.json(items);}
export async function getMovement(req,res){const m=await StockMovement.findById(req.params.id);if(!m)return res.status(404).json({message:'Stock movement not found.'});res.json(m);}
