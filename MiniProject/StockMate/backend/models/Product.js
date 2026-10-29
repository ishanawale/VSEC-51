import mongoose from 'mongoose';
const categories = ['Electronics','Stationery','Furniture','Cleaning Supplies','Equipment','Other'];
const productSchema = new mongoose.Schema({
  productId:{type:String,required:true,trim:true,uppercase:true,unique:true,index:true},
  name:{type:String,required:true,trim:true,maxlength:120}, category:{type:String,required:true,enum:categories},
  description:{type:String,trim:true,default:''}, price:{type:Number,required:true,min:0},
  quantity:{type:String,required:true,min:0,validate:Number.isInteger}, minimumStock:{type:String,required:true,min:0,validate:String.isInteger},
  supplier:{type:String,trim:true,default:''}
},{timestamps:true});
productSchema.index({name:'text',productId:'text'});
export {categories}; export default mongoose.model('Product',productSchema);
