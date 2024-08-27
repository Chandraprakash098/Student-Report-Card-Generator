const Student = require("../models/studentModel");
const xlsx = require("xlsx");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const url = require("url");


const uploadMarks = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const entry of data) {
      const subjects = [];
      for (let i = 1; i <= 10; i++) {
        // Adjust the number of subjects as needed
        if (entry[`Subject${i}`] && entry[`Marks${i}`]) {
          subjects.push({
            subjectName: entry[`Subject${i}`],
            marks: entry[`Marks${i}`],
            grade: entry[`Grade${i}`] || "",
            remarks: entry[`Remarks${i}`] || "",
          });
        }
      }

      // Check if a student with the same rollNo already exists
      let student = await Student.findOne({ rollNo: entry.RollNo });

      if (student) {
        // If student exists, update their information
        student.name = entry.Name;
        student.class = entry.Class;
        student.subjects = subjects;
      } else {
        // If student doesn't exist, create a new one
        student = new Student({
          name: entry.Name,
          rollNo: entry.RollNo,
          class: entry.Class,
          subjects: subjects,
        });
      }

      await student.save();
    }

    res.status(200).json({ message: "Marks uploaded successfully" });
  } catch (error) {
    console.error("Error uploading marks:", error);
    res.status(500).json({ message: error.message });
  }
};

const generateReportCard = async (req, res) => {
  try {
    const students = await Student.find({});
    const reportCards = [];

    for (const student of students) {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        reportCards.push({
          studentName: student.name,
          rollNo: student.rollNo,
          pdfBuffer: pdfData.toString("base64"),
        });

        if (reportCards.length === students.length) {
          res.status(200).json({
            message: "Report cards generated successfully",
            reportCards,
          });
        }
      });

      
      doc.fontSize(24).text("I.K.GUJRAL PUNJAB TECHNICAL UNIVERSITY", { align: "center" });
      doc.moveDown();

      
      doc.moveTo(50, 100).lineTo(550, 100).stroke();
      doc.moveDown();

      
      doc.fontSize(18).text("Student Report Card", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Name: ${student.name}`, { align: "left" });
      doc.text(`Class: ${student.class}`, { align: "left" });
      doc.text(`Roll No: ${student.rollNo}`, { align: "left" });
      doc.moveDown();

      // Table header
      const tableTop = 250;
      const tableLeft = 50;
      const tableRight = 550;
      const rowHeight = 30;
      let currentTop = tableTop;

      doc.font("Helvetica-Bold");
      doc.text("Subject", tableLeft, currentTop);
      doc.text("Marks", tableLeft + 200, currentTop);
      doc.text("Grade", tableLeft + 300, currentTop);
      doc.text("Remarks", tableLeft + 400, currentTop);

      // Horizontal line below header
      currentTop += rowHeight;
      doc.moveTo(tableLeft, currentTop).lineTo(tableRight, currentTop).stroke();

      // Table rows
      doc.font("Helvetica");
      student.subjects.forEach((subject, index) => {
        currentTop += rowHeight;
        doc.text(subject.subjectName, tableLeft, currentTop);
        doc.text(subject.marks.toString(), tableLeft + 200, currentTop);
        doc.text(subject.grade, tableLeft + 300, currentTop);
        doc.text(subject.remarks, tableLeft + 400, currentTop);

        // Add horizontal line after each row
        currentTop += rowHeight;
        doc
          .moveTo(tableLeft, currentTop)
          .lineTo(tableRight, currentTop)
          .stroke();
      });

      // Calculate total and percentage
      const totalMarks = student.subjects.reduce(
        (sum, subject) => sum + subject.marks,
        0
      );
      const percentage = (totalMarks / (student.subjects.length * 100)) * 100;

      currentTop += rowHeight;
      doc.font("Helvetica-Bold");
      doc.text(`Total Marks: ${totalMarks}`, tableLeft, currentTop);
      doc.text(
        `Percentage: ${percentage.toFixed(2)}%`,
        tableLeft + 200,
        currentTop
      );

      // Add a signature line
      doc.moveDown(4);
      doc.moveTo(400, doc.y).lineTo(550, doc.y).stroke();
      doc.text("Principal's Signature", 400, doc.y + 10);

      doc.end();
    }
  } catch (error) {
    console.error("Error generating report cards:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadMarks, generateReportCard };
