const router = require('express').Router();
const c = require('../controllers/taskController');
const { validateId } = require('../middleware/helpers');

router.route('/').get(c.getTasks).post(c.createTask);
router.route('/:id').put(validateId, c.updateTask).delete(validateId, c.deleteTask);

module.exports = router;
