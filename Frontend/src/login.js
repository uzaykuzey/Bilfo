import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import api from "./api/axios_config";
import { useAuth } from './AuthContext';

export default function LoginForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!userId || !password) {
      alert("Please fill in both fields.");
      return;
    }

    const loginData = { userId, password };

    try {
      const response = await api.post("/user/login", loginData);
      console.log("Full Response:", response);
      console.log("Response data:", response.data);
      console.log("BilkentId:", response.data.bilkentId);
      console.log("Status:", response.data.status);
      
      if (response.status === 200) {
        await login(response.data.token);
        
        const bilkentId = response.data.bilkentId;
        const status = response.data.status;
        console.log("About to navigate with:", {
          bilkentId,
          status,
          path: `/userHome/${bilkentId}`,
          state: { statusUser: status }
        });
        
        navigate(`/userHome/${bilkentId}`, { 
          state: { statusUser: status },
          replace: true
        });
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        alert(error.response.data || "An error occurred. Please try again later.");
      } else if (error.request) {
        alert("No response received from the server. Please check your network connection.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <button className="close-button" onClick={handleClose}>
          ×
        </button>
        <div className="logo-section">
          <img src="/bilkent.png" alt="Bilkent Logo" className="university-logo" />
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
          <a href="/forgot_password" className="forgot-password-link">
            Forgot Password
          </a>
        </form>
      </div>
    </div>
  );
}
