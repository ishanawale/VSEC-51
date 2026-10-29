import {Router} from 'express';
import {dashboard} from '../controllers/dashboardController.js';
const r=Router();
r.get('/',dashboard);
export default r;
