import React, { useState } from "react";
import axios from "axios";
import "./UploadMarks.css";

function UploadMarks() {
  const [file, setFile] = useState(null);
  const [reportCards, setReportCards] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "http://localhost:3500/api/students/upload-marks",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Marks uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload marks.");
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3500/api/students/generate-report-cards"
      );
      setReportCards(response.data.reportCards);
      alert("Report cards generated successfully");
    } catch (error) {
      console.error("Error generating report cards:", error);
      alert("Failed to generate report cards.");
    }
  };

  const handleDownloadPDF = (pdfBuffer, studentName) => {
    // Convert base64 to blob
    const byteCharacters = atob(pdfBuffer);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Create download link
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${studentName}_report_card.pdf`;
    link.click();

    // Clean up
    window.URL.revokeObjectURL(link.href);
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2 className="upload-header">Upload Student Marks</h2>
        <p className="upload-description">
          Upload a CSV or Excel file containing student marks. Ensure the file
          is formatted correctly.
        </p>
        <input type="file" onChange={handleFileChange} className="file-input" />
        <div className="button-group">
          <button onClick={handleUpload} className="button upload-button">
            Upload Marks
          </button>
          <button
            onClick={handleGeneratePDF}
            className="button generate-button"
          >
            Generate Report Cards
          </button>
        </div>
        {reportCards.length > 0 && (
          <div className="report-cards-list">
            <h3>Download Report Cards</h3>
            <ul>
              {reportCards.map((card, index) => (
                <li key={index}>
                  <button
                    onClick={() =>
                      handleDownloadPDF(card.pdfBuffer, card.studentName)
                    }
                  >
                    Download {card.studentName}'s Report Card
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadMarks;
