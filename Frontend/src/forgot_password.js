import React, { useState } from "react";
import "./forgot_password.css";
import { useNavigate } from "react-router-dom";
import api from "./api/axios_config"

export default function ForgotPasswordLayout() {
  const [bilkentID, setBilkentID] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [linkCode, setLinkCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const handleSendEmail = async () => {
    if (bilkentID.length !== 8 || !/^\d{8}$/.test(bilkentID)) {
      alert("Please enter a valid 8-digit Bilkent ID.");
      return;
    }

    try {
      const response = await api.post("/forgotPasswordMail", {
        bilkentId: bilkentID,
      });
      if (response.status === 200) {
        alert("Email sent successfully! Please check your inbox.");
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    if (!linkCode) {
      alert("Please enter the link code.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post("/forgotPasswordChangeRequest", {
        forgotPassword : linkCode ,
        newPassword : newPassword,
        bilkentId : bilkentID
      });
      if (response.status === 200) {
        alert("Password changed successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="forgot-password-modal">
      <button onClick={goToLogin} className="close-button">&times;</button>
      {emailSent ? (
        <>
          <h2>Enter the link code:</h2>
          <input
            type="text"
            placeholder="Link Code"
            className="password-input"
            value={linkCode}
            onChange={(e) => setLinkCode(e.target.value)}
          />
          <h2>Enter your new password:</h2>
          <input
            type="password"
            placeholder="New Password"
            className="password-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <h2>Enter it again:</h2>
          <input
            type="password"
            placeholder="Confirm Password"
            className="password-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleChangePassword} className="send-email-button">
            Change Password
          </button>
        </>
      ) : (
        <>
          <h2>Enter Your Bilkent ID</h2>
          <input
            type="text"
            placeholder="Bilkent ID"
            className="email-input"
            pattern="\d{8}" // Ensures only 8 digits
            maxLength={8}   // Limits the input to 8 characters
            title="Bilkent ID must be exactly 8 digits"
            value={bilkentID}
            onChange={(e) => setBilkentID(e.target.value)}
          />
          <button onClick={handleSendEmail} className="send-email-button">
            Send Email
          </button>
        </>
      )}
    </div>
  );
}
