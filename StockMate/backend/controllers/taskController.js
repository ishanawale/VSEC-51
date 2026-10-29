const Task = require('../models/Task');
const { asyncHandler, httpError, str } = require('../middleware/helpers');

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

function parseTask(body, partial) {
  const b = body && typeof body === 'object' ? body : {};
  const errors = {};
  const data = {};

  if (!partial || has(b, 'title')) {
    data.title = str(b.title);
    if (!data.title) errors.title = 'Title is required';
    else if (data.title.length > 120) errors.title = 'Title must be 120 characters or fewer';
  }
  if (!partial || has(b, 'description')) {
    data.description = str(b.description);
    if (data.description.length > 500) errors.description = 'Description must be 500 characters or fewer';
  }
  if (!partial || has(b, 'priority')) {
    data.priority = str(b.priority) || 'Medium';
    if (!['Low', 'Medium', 'High'].includes(data.priority)) errors.priority = 'Priority must be Low, Medium or High';
  }
  if (has(b, 'dueDate')) {
    if (b.dueDate === '' || b.dueDate === null) data.dueDate = null;
    else {
      const d = new Date(typeof b.dueDate === 'string' ? b.dueDate : NaN);
      if (Number.isNaN(d.getTime())) errors.dueDate = 'Due date is not a valid date';
      else data.dueDate = d;
    }
  }
  if (has(b, 'completed')) {
    if (typeof b.completed !== 'boolean') errors.completed = 'Completed must be true or false';
    else data.completed = b.completed;
  }
  return { errors, data };
}

// POST /api/tasks
exports.createTask = asyncHandler(async (req, res) => {
  const { errors, data } = parseTask(req.body, false);
  if (Object.keys(errors).length) throw httpError(400, 'Please fix the highlighted fields', errors);
  const task = await Task.create(data);
  res.status(201).json({ message: 'Task created', task });
});

// GET /api/tasks?status=pending|completed&priority=Low|Medium|High
exports.getTasks = asyncHandler(async (req, res) => {
  const filter = {};
  const status = str(req.query.status);
  if (status === 'pending') filter.completed = false;
  if (status === 'completed') filter.completed = true;
  const priority = str(req.query.priority);
  if (['Low', 'Medium', 'High'].includes(priority)) filter.priority = priority;

  const [tasks, pending, completed] = await Promise.all([
    Task.find(filter).sort({ completed: 1, createdAt: -1 }),
    Task.countDocuments({ completed: false }),
    Task.countDocuments({ completed: true }),
  ]);
  res.json({ tasks, counts: { pending, completed, total: pending + completed } });
});

// PUT /api/tasks/:id  (also used to toggle completed)
exports.updateTask = asyncHandler(async (req, res) => {
  const { errors, data } = parseTask(req.body, true);
  if (Object.keys(errors).length) throw httpError(400, 'Please fix the highlighted fields', errors);
  const task = await Task.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!task) throw httpError(404, 'Task not found');
  res.json({ message: 'Task updated', task });
});

// DELETE /api/tasks/:id
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw httpError(404, 'Task not found');
  res.json({ message: 'Task deleted' });
});
