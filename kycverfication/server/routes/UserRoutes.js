// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { checkUser } = require("../controllers/userController");

router.post("/", checkUser);

module.exports = router;
