import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';
const validStock = (status,q,m) => status==='out' ? q===0 : status==='low' ? q>0&&q<=m : status==='in' ? q>m : true;
export async function listProducts(req,res){
 const {search='',category='',status='',sort='createdAt',order='desc',page='1',limit='100'}=req.query;
 const filter={}; if(category) filter.category=category;
 if(search.trim()) filter.$or=[{name:{$regex:search.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),$options:'i'}},{productId:{$regex:search.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),$options:'i'}}];
 const p=Math.max(1,parseInt(page)||1), l=Math.min(200,Math.max(1,parseInt(limit)||100));
 let items=await Product.find(filter).sort({[ ['name','quantity','price','createdAt'].includes(sort)?sort:'createdAt']:order==='asc'?1:-1}).lean();
 if(status) items=items.filter(x=>validStock(status,x.quantity,x.minimumStock));
 const total=items.length; res.json({items:items.slice((p-1)*l,p*l),total,page:p,pages:Math.max(1,Math.ceil(total/l))});
}
export async function getProduct(req,res){const p=await Product.findById(req.params.id);if(!p)return res.status(404).json({message:'Product not found.'});res.json(p);}
export async function createProduct(req,res){const body={...req.body}; if(body.productId)body.productId=String(body.productId).trim().toUpperCase(); const p=await Product.create(body);res.status(201).json(p);}
export async function updateProduct(req,res){const body={...req.body};if(body.productId)body.productId=String(body.productId).trim().toUpperCase();const p=await Product.findByIdAndUpdate(req.params.id,body,{new:true,runValidators:true});if(!p)return res.status(404).json({message:'Product not found.'});res.json(p);}
export async function deleteProduct(req,res){const p=await Product.findById(req.params.id);if(!p)return res.status(404).json({message:'Product not found.'});await Product.deleteOne({_id:p._id});await StockMovement.updateMany({product:p._id},{$set:{product:null}});res.json({message:'Product deleted. Historical stock movements were retained.'});}
export async function searchProducts(req,res){req.query.search=req.params.query;return listProducts(req,res);}
