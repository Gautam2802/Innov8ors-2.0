// src/pages/UploadDocuments.jsx
import  { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../api/api";

const UploadDocuments = ({ userId, onUploadSuccess }) => {
  const [idDocument, setIdDocument] = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const [idPreview, setIdPreview] = useState("");
  const [secondPreview, setSecondPreview] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (name === "id_document") {
      setIdDocument(file);
      setIdPreview(URL.createObjectURL(file));
    }
    if (name === "second_image") {
      setSecondImage(file);
      setSecondPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id_document", idDocument);
    formData.append("second_image", secondImage);
    formData.append("userId", userId);

    try {
      // Send files to backend for Cloudinary upload and MongoDB storage
      const response = await api.post("/upload-documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Documents uploaded successfully!");
      onUploadSuccess(response.data);
      navigate("/capture-live-image");// Proceed to the next step
    } catch (error) {
      setMessage("Error uploading files: " + error.message);
    }
  };

  return (
    <div>
      <h2>Upload Documents</h2>
      <form onSubmit={handleUpload}>
        <label>
          ID Document:
          <input
            type="file"
            name="id_document"
            onChange={handleFileChange}
            required
          />
          {idPreview && <img src={idPreview} alt="ID Preview" width="100" />}
        </label>
        <br />
        <label>
          Second Image:
          <input
            type="file"
            name="second_image"
            onChange={handleFileChange}
            required
          />
          {secondPreview && (
            <img src={secondPreview} alt="Second Preview" width="100" />
          )}
        </label>
        <br />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default UploadDocuments;
