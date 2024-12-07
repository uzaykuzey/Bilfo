import React from "react";
import "./userSettings.css";

export default function UserSettingsLayout() {
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
            <div className="form-group">
              <h3>Username</h3>
              <input type="text" placeholder="Username" />
              <input type="password" placeholder="Enter Password" />
              <button>Change Username</button>
            </div>

            <div className="form-group">
              <h3>Email</h3>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Enter Password" />
              <button>Change Email</button>
            </div>

            <div className="form-group">
              <h3>Password</h3>
              <input type="password" placeholder="Old Password" />
              <input type="password" placeholder="New Password" />
              <input type="password" placeholder="New Password Again" />
              <button>Change Password</button>
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
