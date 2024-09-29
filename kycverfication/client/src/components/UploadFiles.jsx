// src/components/UploadFiles.js
import React, { useState } from "react";
import api from "../api/api";

const UploadFiles = () => {
  const [idDocument, setIdDocument] = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "id_document") setIdDocument(files[0]);
    if (name === "second_image") setSecondImage(files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id_document", idDocument);
    formData.append("second_image", secondImage);

    try {
      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.status);
    } catch (error) {
      setMessage("Error uploading files: " + error.message);
    }
  };

  return (
    <div>
      <h3>Upload Documents</h3>
      <form onSubmit={handleUpload}>
        <label>
          ID Document:
          <input
            type="file"
            name="id_document"
            onChange={handleFileChange}
            required
          />
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
        </label>
        <br />
        <button type="submit">Upload Files</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default UploadFiles;
