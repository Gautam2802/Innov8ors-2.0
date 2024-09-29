// src/pages/LiveCapture.jsx
import { useState } from "react";
import api from "../api/api"; // Axios instance setup for API requests
import { useNavigate } from "react-router-dom";

const LiveCapture = ({ userId }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleStartCapture = async () => {
    setLoading(true);
    setMessage("");

    try {
      const body = {
        userId: userId, // Replace `userId` with the actual user ID variable
      };
      // Trigger the backend to start capturing frames and perform verification
      const response = await api.post("/upload_live",body); // Ensure this matches the backend route

      // Determine the result based on the response from the backend
      if (response.data.result === "real") {
        setMessage("Live image upload Successful !");
        navigate("/authentication");
      } else {
        setMessage("Live image upload failed !");
      }
    } catch (error) {
      setMessage("Error during verification: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Live Image Capture</h2>
      <button onClick={handleStartCapture} disabled={loading}>
        {loading ? "Capturing..." : "Start Capture"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LiveCapture;
