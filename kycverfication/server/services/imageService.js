// services/imageService.js
const axios = require("axios");

async function verifyImages(liveImage, idImage, secondImage) {
  // Call the external Python service for processing
  const response = await axios.post("http://localhost:8000/verify-images", {
    liveImage,
    idImage,
    secondImage,
  });
  return response.data;
}

module.exports = { verifyImages };
