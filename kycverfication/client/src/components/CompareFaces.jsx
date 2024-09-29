import React, { useState, useEffect } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import api from "../api/api";

const CompareFaces = ({ userId }) => {
  const [idImageUrl, setIdImageUrl] = useState("");
  const [capturedImageUrl, setCapturedImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load face-api.js models
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };

    loadModels();

    // Fetch image URLs from the Flask server
    // const body = {
    //   userId: userId, // Replace `userId` with the actual user ID variable
    // };
    // const response = api.post("/get_images", body);
    // setIdImageUrl(response.data.id_image_url);
    // setCapturedImageUrl(response.data.captured_image_url);
    // setLoading(false);

    const fetchImages = async () => {
      try {
        // Make sure the URL is correct and matches the backend route
        const response = await api.post("/get_images", {
          headers: {
            "Content-Type": "application/json",
          },
          userId
        });

        // Check if the response is successful and set images state
        if (response.status === 200) {
          setIdImageUrl(response.data.id_image_url);
          setCapturedImageUrl(response.data.captured_image_url);
          setLoading(false);
        } else {
          console.error(
            "Error fetching images, response status - failure:");
        }
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    };

    fetchImages();

  }, []);

  const handleCompare = async () => {
    if (!idImageUrl || !capturedImageUrl) return;

    // Load images from URLs
    const idImage = await faceapi.fetchImage(idImageUrl);
    const capturedImage = await faceapi.fetchImage(capturedImageUrl);

    // Detect and extract faces
    const idFaceDescriptor = await detectFace(idImage);
    const capturedFaceDescriptor = await detectFace(capturedImage);

    // Compare faces
    if (idFaceDescriptor && capturedFaceDescriptor) {
      const difference = faceapi.euclideanDistance(
        idFaceDescriptor,
        capturedFaceDescriptor
      );

      // Threshold for a match (tune this as per your requirement)
      const threshold = 0.7;
      const isMatch = difference < threshold;

      // Redirect based on the result
      navigate("/result", { state: { isMatch, difference } });
    } else {
      console.log("Face not detected in one of the images");
    }
  };

  // Function to detect face and get its descriptor
  const detectFace = async (image) => {
    const detection = await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detection?.descriptor;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Compare Faces</h1>
      <img src={idImageUrl} alt="ID Image" width="200" />
      <img src={capturedImageUrl} alt="Captured Image" width="200" />
      <button onClick={handleCompare}>Compare Faces</button>
    </div>
  );
};

CompareFaces.propTypes = {
  userId: PropTypes.string, // Use .isRequired if the prop is mandatory
};

export default CompareFaces;
