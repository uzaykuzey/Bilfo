import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./userSettings.css";
import api from "./api/axios_config"

export default function UserSettingsLayout() {
  // State variables to handle form inputs
  const [username, setUsername] = useState("");
  const [passwordForUsername, setPasswordForUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passwordForEmail, setPasswordForEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { bilkentId } = useParams();
  // Function to handle username change
  const handleChangeUsername = async () => {
    if (!username || !passwordForUsername) {
      alert("Please fill out all fields for username change.");
      return;
    }
    const usernameData = {username: username, password: passwordForUsername, id: bilkentId};
    try {
      const response = await api.post("/changeOwnUsername", usernameData);
      if (response.status == 200) {
        alert("Username changed successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert("Failed to change username.");
    }
  };

  // Function to handle email change
  const handleChangeEmail = async () => {
    if (!email || !passwordForEmail) {
      alert("Please fill out all fields for email change.");
      return;
    }
    const emailData = {email: email, password: passwordForUsername, id: bilkentId};
    try {
      const response = await api.post("/changeOwnEmail", emailData);
      if (response.ok) {
        alert("Email changed successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error changing email:", error);
      alert("Failed to change email.");
    }
  };

  // Function to handle password change
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      alert("Please fill out all fields for password change.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`/changeOwnPassword/${bilkentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (response.ok) {
        alert("Password changed successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password.");
    }
  };

  return (
    <div className="home-layout">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo-container">
          <div className="logo">
            <img
              src="/bilkent.png?height=60&width=60"
              alt="University Logo"
              className="logo-image"
            />
            <div className="logo-text">
              <h1>BILFO</h1>
              <p>Bilkent Information Office</p>
            </div>
          </div>
        </div>

        <div className="nav-links">
          <a href="/profile" className="nav-link">Profile</a>
          <a href="/tours-fairs" className="nav-link">Tours and Fairs</a>
          <a href="/puantaj" className="nav-link">Puantaj Table</a>
          <a href="/logout" className="nav-link">Log Out</a>
        </div>

        <div className="language-switcher">
          <img
            src="/Flag_England.png?height=32&width=40"
            alt="English"
            className="language-icon"
          />
          <img
            src="/Flag_of_Turkey.png?height=32&width=40"
            alt="Turkish"
            className="language-icon"
          />
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="profile-section">
          <div className="profile-pic">
            <img src="/path/to/profile-picture.png" alt="User Profile" />
          </div>
          <button className="save-icon">Save Icon</button>
        </div>

        <div className="editing-section">
          <div className="editing-header">
            <h2>Editing</h2>
            <span className="edit-icon">✏️</span>
          </div>

          <div className="form-container">
            {/* Username */}
            <div className="form-group">
              <h3>Username</h3>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={passwordForUsername}
                onChange={(e) => setPasswordForUsername(e.target.value)}
              />
              <button onClick={handleChangeUsername}>Change Username</button>
            </div>

            {/* Email */}
            <div className="form-group">
              <h3>Email</h3>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={passwordForEmail}
                onChange={(e) => setPasswordForEmail(e.target.value)}
              />
              <button onClick={handleChangeEmail}>Change Email</button>
            </div>

            {/* Password */}
            <div className="form-group">
              <h3>Password</h3>
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password Again"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <button onClick={handleChangePassword}>Change Password</button>
            </div>
          </div>
        </div>
      </div>

      {/* Advisor Info */}
      <div className="advisor-section">
        <p>
          Advisor of the day: <strong>John Smith</strong> <br />
          <a href="mailto:johnsmith@ug.bilkent.edu.tr">
            johnsmith@ug.bilkent.edu.tr
          </a>
        </p>
      </div>
    </div>
  );
}
