import "./userHome.css";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NavbarLayout from "./navbar";

export default function UserHomeLayout() {
  const { bilkentId } = useParams();
  const {state} = useLocation();
  const navigate = useNavigate();
  const { statusUser } = state;

  console.log(statusUser);
  
  return (
    <div className="home-layout">
      {<NavbarLayout/>}

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
                  <a href={navigate(`/userHome/${bilkentId}/settings`,{state:statusUser})} className="nav-link"><i className="fas fa-user-circle"></i> </a>
                </h2>
                <h3>{statusUser == 'ADVISOR' ? "Advisor" : "Guide"}</h3>
              </div>
            </div>

            {/* Profile Details */}
            <div className="profile-details">
              <p><strong>Username:</strong> Emir Görgülü</p>
              <p><strong>E-mail:</strong> emir.gorgulu@ug.bilkent.edu.tr</p>
              <p><strong>Role:</strong> {statusUser}</p>
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
