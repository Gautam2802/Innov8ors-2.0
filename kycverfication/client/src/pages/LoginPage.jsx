// src/pages/LoginPage.jsx
import { useState } from "react";
import api from "../api/api"; // Import API setup

const LoginPage = ({ onLoginSuccess }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  // Validation checks
  const validateInputs = () => {
    if (!name) return "Name is required";
    if (!/^[a-zA-Z\s]+$/.test(name))
      return "Name must contain only letters and spaces";
    if (!mobile) return "Mobile number is required";
    if (!/^\d{10}$/.test(mobile)) return "Mobile number must be 10 digits";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Send data to backend to save in MongoDB
      const response = await api.post("/login", { name, mobile });
      onLoginSuccess(response.data.userId); // Pass user ID to next page
    } catch (error) {
      setError("User already exists !!");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Mobile Number:
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
