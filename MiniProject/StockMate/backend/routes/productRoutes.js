import {Router} from 'express';
import {listProducts,getProduct,createProduct,updateProduct,deleteProduct,searchProducts} from '../controllers/productController.js';
const r=Router();r.get('/search/:query',searchProducts);
r.get('/',listProducts);
r.post('/',createProduct);r.get('/:id',getProduct);
r.put('/:id',updateProduct);
r.delete('/:id',deleteProduct);
export default r;
