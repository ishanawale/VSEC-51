const router = require('express').Router();
const c = require('../controllers/productController');
const { validateId } = require('../middleware/helpers');

router.get('/search/:query', c.searchProducts); // keep BEFORE '/:id' so "search" is not read as an id
router.route('/').get(c.getProducts).post(c.createProduct);
router.route('/:id').get(validateId, c.getProduct).put(validateId, c.updateProduct).delete(validateId, c.deleteProduct);

module.exports = router;
