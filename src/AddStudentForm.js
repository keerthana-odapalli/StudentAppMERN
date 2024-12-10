import React, { useState } from "react";
import axios from "axios";

function AddStudentForm() {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    scores: {
      Java: 0,
      CPP: 0,
      Python: 0,
      GenAI: 0,
      FSD: 0,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested scores object
    if (name in formData.scores) {
      setFormData((prev) => ({
        ...prev,
        scores: { ...prev.scores, [name]: Number(value) },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://6d61-183-82-112-19.ngrok-free.app/add-student", formData, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then(() => {
        alert("Student added successfully");
        setFormData({
          name: "",
          rollNo: "",
          scores: { Java: 0, CPP: 0, Python: 0, GenAI: 0, FSD: 0 },
        });
      })
      .catch((error) => {
        console.error("Error adding student:", error);
        alert("Failed to add student.");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Roll No:</label>
        <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} required />
      </div>
      <div>
        <label>Java:</label>
        <input type="number" name="Java" value={formData.scores.Java} onChange={handleChange} required />
      </div>
      <div>
        <label>CPP:</label>
        <input type="number" name="CPP" value={formData.scores.CPP} onChange={handleChange} required />
      </div>
      <div>
        <label>Python:</label>
        <input type="number" name="Python" value={formData.scores.Python} onChange={handleChange} required />
      </div>
      <div>
        <label>GenAI:</label>
        <input type="number" name="GenAI" value={formData.scores.GenAI} onChange={handleChange} required />
      </div>
      <div>
        <label>FSD:</label>
        <input type="number" name="FSD" value={formData.scores.FSD} onChange={handleChange} required />
      </div>
      <button type="submit">Add Student</button>
    </form>
  );
}

export default AddStudentForm;