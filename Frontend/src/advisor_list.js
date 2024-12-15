import "./advisor_list.css";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "./api/axios_config";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css"; // Ensure this CSS is imported

export default function AdvisorListLayout() {
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { statusUser } = state;
  const [advisors, setAdvisors] = useState([]);
  const [deleteAdvisor, setDeleteAdvisor] = useState(null); // State for selected advisor to delete

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await api.get("/getAdvisors");
        if (response.status === 200) {
          setAdvisors(response.data);
        } else if (response.status === 204) {
          setAdvisors([]);
        }
      } catch (err) {
        console.error("Error fetching guides:", err);
      }
    };

    fetchAdvisors();
  }, []);

  const goToGuideList = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/guide_list`, { state: { statusUser } });
  };
  const goToAdvisorlist = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/advisor_list`, { state: { statusUser } });
  };
  const goToTourFairList = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/tour_fair_list`, { state: { statusUser } });
  };

  const handleRemoveClick = (advisor) => {
    setDeleteAdvisor(advisor); // Set the advisor data to be removed
  };

  const handleRemoveAdvisor = async () => {
    try {
      if (deleteAdvisor) {
        console.log(deleteAdvisor.id);
        const response = await api.post(`/removeAdvisor`,{id : deleteAdvisor.id});
        if (response.status === 200) {
          setAdvisors(advisors.filter(advisor => advisor.id !== deleteAdvisor.id)); // Update advisor list
          setDeleteAdvisor(null); // Reset the deletion state after successful removal
        }
      }
    } catch (error) {
      console.error("Error removing advisor:", error);
    }
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
          <a className="nav-link" onClick={goToTourFairList}>Tours and Fairs</a>

          {statusUser === "COORDINATOR" || statusUser === "ADVISOR" && (
            <a className="nav-link" onClick={goToAdvisorlist}>Advisor List</a>
          )}

          {statusUser === "ADVISOR" && (
            <a className="nav-link" onClick={goToGuideList}>Guide List</a>
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

      <div className="content">
        <h2>Advisor List</h2>
        <div className="advisor-list">
          <div className="search-bar">
            <button className="add-advisor-btn">Add Advisor</button>
          </div>

          <table className="advisor-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>E-mail</th>
                <th>ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {advisors.map((advisor) => (
                <tr key={advisor.id}>
                  <td>{advisor.username}</td>
                  <td>{advisor.email}</td>
                  <td>{advisor.bilkentId}</td>
                  <td className="actions">
                    <button>Promote</button>
                    <button>Demote</button>

                    {/* Trigger the popup when remove button is clicked */}
                    <button onClick={() => handleRemoveClick(advisor)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup for confirmation */}
      {deleteAdvisor && (
        <Popup open={true} onClose={() => setDeleteAdvisor(null)} position="right center">
          <div className="popup-container">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete Advisor {' '}
              <strong>{deleteAdvisor.username}</strong> with Bilkent ID{' '}
              <strong>{deleteAdvisor.bilkentId}</strong>?
            </p>
            <div className="popup-actions">
              <button
                onClick={() => {
                  handleRemoveAdvisor(); // Call remove function
                  setDeleteAdvisor(null); // Close the popup after removal
                }}
              >
                Remove
              </button>
              <button onClick={() => setDeleteAdvisor(null)}>Cancel</button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
