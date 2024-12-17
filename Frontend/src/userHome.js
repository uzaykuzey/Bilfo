import "./userHome.css";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NavbarLayout from "./navbar";
import { Link } from "react-router-dom";

export default function UserHomeLayout() {
  const { bilkentId } = useParams();
  const {state} = useLocation();
  const navigate = useNavigate();
  const { statusUser } = state;

  console.log(statusUser);
  const goToAvailability = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/availability`, {state : {statusUser}});
  }
  const goToSchedule = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/schedule`, {state : {statusUser}});
  }
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
                  <Link 
                    to={`/userHome/${bilkentId}/settings`} 
                    state={statusUser} 
                    className="nav-link"
                  >
                    <i className="fas fa-user-circle"></i>
                  </Link></h2>
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
              <button className="action-button" onClick={goToSchedule}>See Tour Schedule</button>
              <button className="action-button" onClick={goToAvailability}>See Availability Schedule</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
