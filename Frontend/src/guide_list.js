import "./guide_list.css";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "./api/axios_config";

export default function GuideListLayout() {
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const { statusUser } = state;
  const navigate = useNavigate();

  const [guides, setGuides] = useState([]);
  const [error, setError] = useState("");

  // Fetch guides when the component loads
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await api.get("/getGuides");
        if (response.status === 200) {
          setGuides(response.data);
        } else if (response.status === 204) {
          setGuides([]); // No guides available
        }
      } catch (err) {
        console.error("Error fetching guides:", err);
        setError("An error occurred while fetching guides.");
      }
    };

    fetchGuides();
  }, []);

  const goToGuideList = (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    navigate(`/userHome/${bilkentId}/guide_list`, { state: { statusUser } });
  };

  const handlePromote = async (id) => {
    try {
      const response = await api.post("/promoteUser",)
    } catch (error) {
      console.log(error)
    }
    
  };

  const handleRemove = (id) => {
    
  };

  const handleLogs = (id) => {
    
  };

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

          {/* Conditionally render Guide List link for Advisors */}
          {statusUser === "ADVISOR" && (
            <a className="nav-link" onClick={goToGuideList}>
              Guide List
            </a>
          )}

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

      {/* Main Content Area */}
      <div className="content">
        <h1>Guide List</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="guide-table-container">
          <table className="guide-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>E-mail</th>
                <th>ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.length > 0 ? (
                guides.map((guide, index) => (
                  <tr key={index}>
                    <td>{guide.username}</td>
                    <td>{guide.email}</td>
                    <td>{guide.bilkentId}</td>
                    <td>
                      <button
                        className="action-btn logs-btn"
                        onClick={() => handleLogs(guide.bilkentId)}
                      >
                        See Logs
                      </button>
                      <button
                        className="action-btn promote-btn"
                        onClick={() => handlePromote(guide.bilkentId)}
                      >
                        Promote
                      </button>
                      <button
                        className="action-btn remove-btn"
                        onClick={() => handleRemove(guide.bilkentId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No guides available.</td>
                </tr>
              )}
            </tbody>
          </table>
          <button className="add-guide-btn">Add Guide</button>
        </div>
        </div>
    </div>
  );
}
