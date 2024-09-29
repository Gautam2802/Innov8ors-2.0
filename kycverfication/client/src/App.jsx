// src/App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UploadDocuments from "./pages/UploadDocuments";
import CaptureLiveImage from "./pages/LiveCapture";
import CompareFaces from "./components/CompareFaces";
import ResultPage from "./pages/ResultPage";
function App() {
  // State to manage the logged-in user's ID, which will be used across pages
  const [userId, setUserId] = useState(null);

  // Handler to set the user ID after successful login
  const handleLoginSuccess = (id) => {
    setUserId(id);
  };

  // Handler to move to the next step after successful document upload
  const handleUploadSuccess = () => {
    // Logic to proceed to the capture image step after successful upload
  };

  // Handler to move to the next step after capturing the live image
  const handleCaptureSuccess = () => {
    // Logic to complete the flow after capturing the live image
  };

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/"
          element={
            !userId ? (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to="/upload-documents" />
            )
          }
        />

        {/* Upload Documents Page */}
        <Route
          path="/upload-documents"
          element={
            userId ? (
              <UploadDocuments
                userId={userId}
                onUploadSuccess={handleUploadSuccess}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Capture Live Image Page */}
        <Route
          path="/capture-live-image"
          element={
            userId ? <CaptureLiveImage userId={userId} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/authentication"
          element={
            userId ? <CompareFaces userId={userId} /> : <Navigate to="/" />
          }
        />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
