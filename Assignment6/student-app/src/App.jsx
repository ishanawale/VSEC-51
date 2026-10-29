import React, { useState } from 'react';
import StudentForm from './components/StudentForm';
import StudentDetails from './components/StudentDetails';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);

  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleDeleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Student Information Portal</h1>
        <p>Assignment 6: React Components & State Management</p>
      </header>

      <main className="main-content">
        <StudentForm onAddStudent={handleAddStudent} />
        <StudentDetails 
          students={students} 
          onDeleteStudent={handleDeleteStudent} 
        />
      </main>
    </div>
  );
}

export default App;