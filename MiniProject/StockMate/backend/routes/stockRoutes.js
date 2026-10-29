import {Router} from 'express';
import {stockIn,stockOut,listMovements,getMovement} from '../controllers/stockController.js';
const r=Router();
r.post('/in',stockIn);
r.post('/out',stockOut);
r.get('/',listMovements);
r.get('/:id',getMovement);export default r;
