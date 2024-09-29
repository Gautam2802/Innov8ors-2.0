// src/api/api.js
import axios from "axios";

// Set up an Axios instance with the base URL of your Flask backend
const api = axios.create({
  baseURL: "http://localhost:5000", // Flask server URL
});

export default api;
