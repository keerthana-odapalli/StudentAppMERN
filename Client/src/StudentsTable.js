import React, { useState, useEffect } from "react";
import axios from "axios";

function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedScores, setEditedScores] = useState({});

  // Fetch students data
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios
    //backend ngrok link
      .get("http://localhost:4000/students", {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => console.error("Error fetching students:", error));
  };

  const handleEditClick = (rollNo, scores) => {
    setEditingRow(rollNo);
    setEditedScores({ ...scores });
  };

  const handleScoreChange = (e) => {
    const { name, value } = e.target;
    setEditedScores((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleUpdate = (rollNo) => {
    axios
      .put(
        `https://6d61-183-82-112-19.ngrok-free.app/student/${rollNo}`,
        { scores: editedScores },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      )
      .then(() => {
        alert("Scores updated successfully.");
        setEditingRow(null);
        fetchStudents(); // Refresh the table
      })
      .catch((error) => {
        console.error("Error updating scores:", error);
        alert("Failed to update scores.");
      });
  };

  const handleDelete = (rollNo) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      axios
        .delete(`https://6d61-183-82-112-19.ngrok-free.app/student/${rollNo}`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        })
        .then(() => {
          alert("Student(s) deleted successfully.");
          fetchStudents(); // Refresh the table
        })
        .catch((error) => {
          console.error("Error deleting student:", error);
          alert("Failed to delete student.");
        });
    }
  };

  return (
    
    <table border="1">  
      <thead>
        <tr>
          <th>Roll No</th>
          <th>Name</th>
          <th>Java</th>
          <th>CPP</th>
          <th>Python</th>
          <th>GenAI</th>
          <th>FSD</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={`row${student.rollNo}`} id={`row${student.rollNo}`}>
            <td>{student.rollNo}</td>
            <td>{student.name}</td>
            {["Java", "CPP", "Python", "GenAI", "FSD"].map((subject) => (
              <td key={subject}>
                {editingRow === student.rollNo ? (
                  <input
                    type="number"
                    name={subject}
                    value={editedScores[subject]}
                    onChange={handleScoreChange}
                  />
                ) : (
                  student.scores[subject]
                )}
              </td>
            ))}
            <td>
              {editingRow === student.rollNo ? (
                <button
                  id={`update${student.rollNo}`}
                  onClick={() => handleUpdate(student.rollNo)}
                >
                  Submit
                </button>
              ) : (
                <>
                  <button
                    id={`update${student.rollNo}`}
                    onClick={() => handleEditClick(student.rollNo, student.scores)}
                  >
                    Update
                  </button>
                  <button
                    id={`delete${student.rollNo}`}
                    onClick={() => handleDelete(student.rollNo)}
                    style={{ marginLeft: "5px", backgroundColor: "red", color: "white" }}
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
  );
}

export default ViewStudents;
