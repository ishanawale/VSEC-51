const express = require('express');
const router = express.Router();
const Student = require('../models/studentModel');

// POST: Create student
router.post('/', async (req, res) => {
  try {
    const { name, rollNo, department, email, cgpa } = req.body;
    const existingStudent = await Student.findOne({ $or: [{ rollNo }, { email }] });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Roll number or email already exists' });
    }
    const student = await Student.create({ name, rollNo, department, email, cgpa });
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET: All students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET: Student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid ID format', error: error.message });
  }
});

// PUT: Update student
router.put('/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: updatedStudent });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE: Remove student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid ID format', error: error.message });
  }
});

module.exports = router;