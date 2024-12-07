import "./userHome.css";

export default function UserHomeLayout() {
  return (
    <div className="home-layout">
      {/* Sidebar Navigation */}
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
      <main className="main-content">
        {/* Advisor Section */}
        <div className="advisor-section">
          <p>
            Advisor of the day: <strong>John Smith</strong> <br />
            <a href="mailto:johnsmith@ug.bilkent.edu.tr">
              johnsmith@ug.bilkent.edu.tr
            </a>
          </p>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-card">
            {/* Profile Header */}
            <div className="profile-header">
              <img
                src="/user-profile.jpg"
                alt="Emir Görgülü"
                className="profile-image"
              />
              <div className="profile-header-details">
                <h2>
                  Emir Görgülü
                  <a href="/userHome/:bilkentId/settings" className="nav-link"><i className="fas fa-user-circle"></i> </a>
                </h2>
                <h3>Guide</h3>
              </div>
            </div>

            {/* Profile Details */}
            <div className="profile-details">
              <p><strong>Username:</strong> Emir Görgülü</p>
              <p><strong>E-mail:</strong> emir.gorgulu@ug.bilkent.edu.tr</p>
              <p><strong>Role:</strong> Guide</p>
              <p><strong>Total Hours of Service:</strong> 12</p>
            </div>

            {/* Profile Actions */}
            <div className="profile-actions">
              <button className="action-button">See Tour Schedule</button>
              <button className="action-button">See Availability Schedule</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
