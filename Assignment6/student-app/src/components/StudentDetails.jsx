import React from 'react';

const StudentDetails = ({ students, onDeleteStudent }) => {
  const getGrade = (marks) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
  };

  return (
    <div className="card details-container">
      <h2>Submitted Student Records</h2>

      {students.length === 0 ? (
        <p className="empty-state">No student records submitted yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="student-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td><strong>{student.rollNo}</strong></td>
                  <td>{student.name}</td>
                  <td>{student.department}</td>
                  <td>{student.marks} / 100</td>
                  <td>
                    <span className={`badge ${student.marks >= 50 ? 'badge-pass' : 'badge-fail'}`}>
                      {getGrade(student.marks)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => onDeleteStudent(student.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;