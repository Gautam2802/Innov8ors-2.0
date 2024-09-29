// app.js
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const connectDB = require("./config/connectDB");
const userRoutes = require("./routes/userRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
connectDB()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });

// Routes
app.use("/api/user", userRoutes);
app.use("/api/verify", verificationRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.json({
    message: `Server running at port ${port}`,
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
