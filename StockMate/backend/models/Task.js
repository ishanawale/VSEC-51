const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    priority: { type: String, enum: { values: ['Low', 'Medium', 'High'], message: 'Invalid priority' }, default: 'Medium' },
    dueDate: { type: Date, default: null },
    completed: { type: Boolean, default: false },
    isSample: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
