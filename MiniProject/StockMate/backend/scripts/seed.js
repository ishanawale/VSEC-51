import 'dotenv/config';import mongoose from 'mongoose';import Product from '../models/Product.js';import Task from '../models/Task.js';
const products=[
{productId:'P001',name:'Wireless Mouse',category:'Electronics',description:'Ergonomic wireless mouse',price:799,quantity:42,minimumStock:10,supplier:'TechSource'},
{productId:'P002',name:'Keyboard',category:'Electronics',description:'USB office keyboard',price:1199,quantity:18,minimumStock:8,supplier:'TechSource'},
{productId:'P003',name:'Monitor',category:'Electronics',description:'24-inch LED monitor',price:8999,quantity:4,minimumStock:5,supplier:'Display Hub'},
{productId:'P004',name:'Notebook',category:'Stationery',description:'A4 ruled notebook',price:65,quantity:120,minimumStock:25,supplier:'Paper Trail'},
{productId:'P005',name:'Office Chair',category:'Furniture',description:'Adjustable ergonomic chair',price:6499,quantity:7,minimumStock:4,supplier:'Office Living'},
{productId:'P006',name:'USB Cable',category:'Electronics',description:'USB-C charging cable',price:249,quantity:0,minimumStock:12,supplier:'TechSource'},
{productId:'P007',name:'Printer Paper',category:'Stationery',description:'A4 paper ream',price:320,quantity:9,minimumStock:10,supplier:'Paper Trail'},
{productId:'P008',name:'Cleaning Supplies',category:'Cleaning Supplies',description:'General purpose cleaning kit',price:450,quantity:22,minimumStock:6,supplier:'CleanWorks'}];
try{await mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/inventoryDB');for(const p of products)await Product.updateOne({productId:p.productId},{$setOnInsert:p},{upsert:true});const tasks=[{title:'Verify new shipment',description:'Check quantities against the delivery note.',priority:'High'},{title:'Inspect damaged products',description:'Review returned items and update records.',priority:'Medium'},{title:'Reorder stationery',description:'Check notebook and paper stock.',priority:'Low'}];for(const t of tasks)await Task.updateOne({title:t.title},{$setOnInsert:t},{upsert:true});console.log('Seed complete. Existing products and tasks were preserved.');}catch(e){console.error(e.message);process.exitCode=1;}finally{await mongoose.disconnect();}
