const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  name: String,
  rollNo: Number,
  class: String,
  subjects: [
    {
      subjectName: String,
      marks: Number,
      grade: String,
      remarks: String,
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
