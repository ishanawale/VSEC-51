const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    rollNo: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email']
    },
    cgpa: {
      type: Number,
      min: [0, 'CGPA cannot be below 0'],
      max: [10, 'CGPA cannot exceed 10']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);