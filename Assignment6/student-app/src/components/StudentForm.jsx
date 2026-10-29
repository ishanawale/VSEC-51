import React, { useState } from 'react';

const StudentForm = ({ onAddStudent }) => {
  const initialState = {
    name: '',
    rollNo: '',
    department: '',
    marks: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.rollNo.trim() || !formData.department.trim() || !formData.marks) {
      setError('Please fill out all fields.');
      return;
    }

    if (Number(formData.marks) < 0 || Number(formData.marks) > 100) {
      setError('Marks must be between 0 and 100.');
      return;
    }

    setError('');
    onAddStudent({
      ...formData,
      id: Date.now(),
      marks: Number(formData.marks)
    });

    setFormData(initialState);
  };

  return (
    <div className="card form-container">
      <h2>Enter Student Details</h2>
      {error && <div className="alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rollNo">Roll Number</label>
          <input
            id="rollNo"
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            placeholder="e.g. 21CS045"
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">-- Select Department --</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="marks">Marks (out of 100)</label>
          <input
            id="marks"
            type="number"
            name="marks"
            value={formData.marks}
            onChange={handleChange}
            placeholder="e.g. 88"
            min="0"
            max="100"
          />
        </div>

        <button type="submit" className="btn-primary">Submit Details</button>
      </form>
    </div>
  );
};

export default StudentForm;