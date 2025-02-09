import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./userSettings.css";
import api from "./api/axios_config"
import NavbarLayout from "./navbar"

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
    const usernameData = {username: username, password: passwordForUsername, bilkentId: bilkentId};
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
    const emailData = {email: email, password: passwordForEmail, bilkentId: bilkentId};
    try {
      const response = await api.post("/changeOwnEmail", emailData);
      if (response.status == 200) {
        alert("Email changed successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
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
    const passwordData = {newPassword: newPassword,password: oldPassword, bilkentId: bilkentId };
    try {
      const response = await api.post("/changeOwnPassword",passwordData);
      if (response.status == 200) {
        alert("Password changed successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert("Failed to change password.");
    }
  };

  return (
    <div className="home-layout">
      {/* Sidebar */}
      <NavbarLayout/>
      {/* Main Content */}
      <div className="main-content">
        <div className="editing-header">
          <h2>Editing</h2>
          <span className="edit-icon">✏️</span>
        </div>

        <div className="editing-section">
          <div className="form-container-settings">
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
    </div>
  );
}
