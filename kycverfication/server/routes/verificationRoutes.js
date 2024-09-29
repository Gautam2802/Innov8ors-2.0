// routes/verificationRoutes.js
const express = require("express");
const router = express.Router();
const { verifyUserImages } = require("../controllers/verificationController");

router.post("/", verifyUserImages);

module.exports = router;
