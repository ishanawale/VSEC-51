import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';import stockRoutes from './routes/stockRoutes.js';
import taskRoutes from './routes/taskRoutes.js';import dashboardRoutes from './routes/dashboardRoutes.js';
import {notFound,errorHandler} from './middleware/errorHandler.js';
const app=express();app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'}));app.use(express.json({limit:'1mb'}));
app.get('/api/health',(req,res)=>res.json({status:'ok',service:'StockMate API',database:mongoose.connection.readyState===1?'connected':'disconnected',time:new Date().toISOString()}));
app.use('/api/products',productRoutes);app.use('/api/stock',stockRoutes);app.use('/api/tasks',taskRoutes);app.use('/api/dashboard',dashboardRoutes);
app.use(notFound);app.use(errorHandler);
const port=process.env.PORT||5000;
try{await mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/inventoryDB',{serverSelectionTimeoutMS:5000});
console.log('MongoDB connected:',mongoose.connection.name);}catch(e){console.error('MongoDB connection failed:',e.message);console.error('API will still start, but database-backed routes will fail until MongoDB is configured.');}
app.listen(port,()=>console.log(`StockMate API listening on http://localhost:${port}`));
