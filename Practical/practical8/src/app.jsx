
import { useState } from "react";

function StudentForm({ onSubmit }) {
    const [name, setName] = useState("");
    const [course, setCourse] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ name, course });
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Enter name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />

            <input
                placeholder="Enter course"
                value={course}
                onChange={e => setCourse(e.target.value)}
                required
            />

            <button type="submit">Submit</button>
        </form>
    );
}

function StudentDisplay({ student }) {
    return (
        <div>
            <h3>Student Details</h3>
            <p>Name: {student.name}</p>
            <p>Course: {student.course}</p>
        </div>
    );
}

export default function App() {
    const [student, setStudent] = useState({
        name: "",
        course: ""
    });

    return (
        <div>
            <h2>Student Form</h2>
            <StudentForm onSubmit={setStudent} />
            <StudentDisplay student={student} />
        </div>
    );
}
