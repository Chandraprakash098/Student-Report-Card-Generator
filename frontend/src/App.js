import React from "react";
import UploadMarks from "./components/UploadMarks";
import '../src/App.css'

function App() {
  return (
    <div className="app-container">
      <h1 className="app-header">Student Report Card Generator</h1>
      <div className="upload-container">
        <UploadMarks />
      </div>
    </div>
  );
}

export default App;
