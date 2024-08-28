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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Catch-all handler to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
