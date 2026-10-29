const router = require('express').Router();
const c = require('../controllers/stockController');
const { validateId } = require('../middleware/helpers');

router.post('/in', c.stockIn);
router.post('/out', c.stockOut);
router.get('/', c.getMovements);
router.get('/:id', validateId, c.getMovement);

module.exports = router;
