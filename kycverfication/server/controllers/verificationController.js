// controllers/verificationController.js
const { verifyImages } = require("../services/imageService");

const verifyUserImages = async (req, res) => {
  const { liveImage, idImage, secondImage } = req.body;
  try {
    const result = await verifyImages(liveImage, idImage, secondImage);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error });
  }
};

module.exports = { verifyUserImages };
