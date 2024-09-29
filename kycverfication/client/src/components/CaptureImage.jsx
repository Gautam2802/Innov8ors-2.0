// src/components/CaptureImage.js
import React, { useState } from "react";
import api from "../api/api";

const CaptureImage = () => {
  const [message, setMessage] = useState("");

  const handleCapture = async () => {
    try {
      const response = await api.get("/capture"); // Call backend endpoint
      setMessage(response.data.status);
    } catch (error) {
      setMessage("Error capturing image: " + error.message);
    }
  };

  return (
    <div>
      <h3>Capture Live Image</h3>
      <button onClick={handleCapture}>Capture Image</button>
      <p>{message}</p>
    </div>
  );
};

export default CaptureImage;
