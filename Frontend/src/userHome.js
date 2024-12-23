import "./userHome.css";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NavbarLayout from "./navbar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./api/axios_config";

export default function UserHomeLayout() {
  const { bilkentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  console.log("Location in UserHome:", location);
  
  // Safely access state and provide fallback
  const statusUser = location.state?.statusUser || 'GUIDE';
  console.log("StatusUser in UserHome:", statusUser);

  const [advisors, setAdvisors] = useState([]); // Stores multiple advisors
  const [profile, setProfile] = useState({
    username: "Loading...",
    email: "",
    role: statusUser,
    totalHours: 0,
    dayOfAdvisor: "N/A",
  });

  // Fetch advisor and profile info on page load
  useEffect(() => {
    const fetchAdvisorAndProfile = async () => {
      try {
        const advisorResponse = await api.get("/getAdvisorsOfTheDay");
        const profileResponse = await api.get("/getUserInfo", {
          params: { bilkentId: bilkentId },
        });

        // Process advisors array
        const advisorsArray = advisorResponse.data.map((advisor) => ({
          name: advisor.username,
          email: advisor.email,
          dayOfAdvisor: advisor.dayOfAdvisor,
        }));

        setAdvisors(advisorsArray);

        setProfile({
          username: profileResponse.data.username,
          email: profileResponse.data.email,
          role: profileResponse.data.status || statusUser,
          totalHours: profileResponse.data.logs.length, // Assuming logs represent service hours
          dayOfAdvisor: profileResponse.data.dayOfAdvisor,
        });

        console.log("Advisors:", advisorsArray);
        console.log("Profile Response:", profileResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (bilkentId) {
      fetchAdvisorAndProfile();
    }
  }, [bilkentId, statusUser]);

  const goToAvailability = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/availability`, { state: { statusUser } });
  };

  const goToSchedule = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/schedule`, { state: { statusUser } });
  };

  const goToSettings = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/settings`, { state: { statusUser } });
  }

  return (
    <div className="home-layout">
      {<NavbarLayout />}

      {/* Main Content */}
      <main className="main-content">
        {/* Advisor Section */}
        <div className="advisor-section">
          <p><strong>Advisors of the day:</strong></p>
          <ul>
            {advisors.map((advisor, index) => (
              <li key={index}>
                {advisor.name} ({advisor.dayOfAdvisor}) -{" "}
                <a href={`mailto:${advisor.email}`}>{advisor.email}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-card">
            {/* Profile Header */}
            <div className="profile-header">
              <img
                src="/user-profile.jpg"
                alt={profile.username}
                className="profile-image"
              />
              <div className="profile-header-details">
                <h2>
                  {profile.username}
                </h2>
                <h3>
                  {(() => {
                    switch (profile.role) {
                      case "ADVISOR":
                        return "Advisor";
                      case "COORDINATOR":
                        return "Coordinator";
                      case "ACTING_DIRECTOR":
                        return "Acting Director";
                      case "ADMIN":
                        return "Admin";
                      default:
                        return "Guide";
                    }
                  })()}
                </h3>
                <h4>
                  <button className="action-button" onClick={goToSettings}>
                    Edit Profile
                  </button>
                </h4>
              </div>
            </div>

            {/* Profile Details */}
            <div className="profile-details">
              <p>
                <strong>Username:</strong> {profile.username}
              </p>
              <p>
                <strong>E-mail:</strong> {profile.email}
              </p>
              <p>
                <strong>Role:</strong> {profile.role}
              </p>
              {profile.role === "ADVISOR" && (
              <p>
                <strong>Day of Advisor:</strong>{" "}
                {profile.dayOfAdvisor === "NOT_ASSIGNED" ? "Not Assigned" : profile.dayOfAdvisor}
              </p>
              )}
              <p>
                <strong>Total Hours of Service:</strong> {profile.totalHours}
              </p>
            </div>

            {/* Profile Actions */}
            <div className="profile-actions">
              <button className="action-button" onClick={goToSchedule}>
                See Tour Schedule
              </button>
              <button className="action-button" onClick={goToAvailability}>
                See Availability Schedule
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
