import mongoose from 'mongoose';
const schema = new mongoose.Schema({title:{type:String,required:true,trim:true,maxlength:160},description:{type:String,trim:true,default:''},priority:{type:String,enum:['Low','Medium','High'],default:'Medium'},dueDate:{type:Date,default:null},completed:{type:Boolean,default:false}},{timestamps:true});
export default mongoose.model('Task',schema);
