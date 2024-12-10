const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors({
//origin: 'https://578f-183-82-112-19.ngrok-free.app',
origin: 'http://localhost:3000/'
}));

mongoose.connect(
//   "mongodb://awwaab2004:candyman123321@cluster0.4rbjs43.mongodb.net/studentsDB?retryWrites=true&w=majority&appName=Cluster0",
//   "mongodb://keerthana:MongoDB18@cluster0.agjj2gn.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0",
  //"mongodb+srv://keerthana:MongoDB18@cluster0.agjj2gn.mongodb.net/test", 
  //"mongodb://127.0.0.1:27017/StudentsDB",
  "mongodb://localhost:27017/Studs",

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection err:", err));

// Define Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  scores: {
    Java: Number,
    CPP: Number,
    Python: Number,
    GenAI: Number,
    FSD: Number,
  },
});

// Create Student Model
const Student = mongoose.model("Student", studentSchema);

// Middleware
app.use(express.json());

// Route to fetch student data by roll number
app.get("/student/:rollNo", async (req, res) => {
  const rollNo = req.params.rollNo;
  try {
    const student = await Student.findOne({ rollNo });
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching student data", error: err });
  }
});
//add-student
app.post("/student", async (req, res) => {
    try {
      const newStudent = new Student(req.body);
      await newStudent.save();
      res.status(201).send("Student added successfully");
    } catch (error) {
      console.error("Failed to add student", error);
      res.status(400).send("Error adding student");
    }
  });  

app.delete('/student/:rollNo',async(req,res)=>
{
  const rollNo = req.params.rollNo
  try
  {
    const deletedStudent = await Student.findOneAndDelete({rollNo})
    if(deletedStudent)
      res.status(200).json({message:'Student deleted successfully',deletedStudent})
    else
      res.status(404).json({message:'Student not found'})
  }
  catch(err)
  {
    res.status(400).json({message:'Failed to delete student',error:err})
  }
})

app.put('/student/:rollNo',async(req,res) =>
{
  const rollNo = req.params.rollNo;
  try
  {
    const updatedStudent = await Student.findOneAndUpdate( {rollNo},req.body,{new:true,runValidators:true} )

    if(updatedStudent)
    {
      res.status(200).json({message:'Student updated successfully',updatedStudent})
    }
    else
    {
      res.status(404).json({message:'Student not found'})
    }
  }
  catch(err)
  {
    res.status(400).json({message:'Failed to update student',error:err})
  }
});

// Retrieve all students' information: rollNo, name, GPA
app.get("/students", async (req, res) => {
    try {
      const students = await Student.find({},{_id:0});
      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).send("Error fetching students");
    }
  });

  // Route to fetch all students' data
  app.get("/", async(req,res)=>
    {
      try
      {
        const students = await Student.find({},{_id:0})     
        res.status(200).json(students)
      }
      catch(err)
      {
        res.status(400).json({message:'Failed to fetch students',error:err})
      }
    })
  

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});