import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import api from "./api/axios_config"

export default function LoginForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
  
    if (!userId || !password) {
      alert("Please fill in both fields.");
      return;
    }
  
    const loginData = { userId, password };
    console.log("Sending login data:", loginData);
  
    try {
      const response = await api.post("/user/login", loginData);
      console.log("Response received:", response);
  
      if (response.status == 200) {
        navigate(`/userHome/${userId}`);
      } else {
        alert(response.data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        alert(`Error: ${error.response.data.message || "An error occurred. Please try again later."}`);
      } else if (error.request) {
        alert("No response received from the server. Please check your network connection.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <button className="close-button">×</button>
        <div className="logo-section">
          <img
            src="/bilkent.png"
            alt="Bilkent Logo"
            className="university-logo"
          />
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="user-id">User Id</label>
            <input
              type="text"
              id="user-id"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">
            Log in
          </button>
          <a href="/forgot-password" className="forgot-password-link">
            Forgot Password
          </a>
        </form>
      </div>
    </div>
  );
}
