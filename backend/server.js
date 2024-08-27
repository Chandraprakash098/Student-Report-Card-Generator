const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors"); 
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");

dotenv.config();
connectDB();

const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(3500, () => {
  console.log("Server is running on port 3500");
});
