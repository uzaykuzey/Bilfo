import "./advisor_list.css";
import NavbarLayout from "./navbar"
import { Route, useParams } from "react-router-dom";
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
  const [demoteAdvisor, setDemoteAdvisor] = useState(null); // State for selected advisor to demote

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

  
  const handleRemoveClick = (advisor) => {
    setDeleteAdvisor(advisor); // Set the advisor data to be removed
  };

  const handleRemoveAdvisor = async () => {
    try {
      if (deleteAdvisor) {
        const response = await api.post(`/removeAdvisor`, { id: deleteAdvisor.id });
        if (response.status === 200) {
          setAdvisors(advisors.filter(advisor => advisor.id !== deleteAdvisor.id)); // Update advisor list
          setDeleteAdvisor(null); // Reset the deletion state after successful removal
        }
      }
    } catch (error) {
      console.error("Error removing advisor:", error);
    }
  };

  const handleDemoteClick = (advisor) => {
    setDemoteAdvisor(advisor); // Set the advisor data to be demoted
  };

  const handleDemoteAdvisor = async () => {
    try {
      if (demoteAdvisor) {
        const response = await api.post(`/demoteAdvisor`, { id: demoteAdvisor.id });
        if (response.status === 200) {
          // Update advisor role in the local state (assuming the API provides new role data)
          setAdvisors(advisors.map(advisor =>
            advisor.id === demoteAdvisor.id ? { ...advisor, role: "USER" } : advisor
          ));
          setDemoteAdvisor(null); // Reset the demotion state after successful demotion
        }
      }
    } catch (error) {
      console.error("Error demoting advisor:", error);
    }
  };

  return (
    <div className="home-layout">
      {/* Sidebar Navigation */}
      {<NavbarLayout/>}

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

                    {/* Trigger the popup when demote button is clicked */}
                    <button onClick={() => handleDemoteClick(advisor)}>Demote</button>

                    {/* Trigger the popup when remove button is clicked */}
                    <button onClick={() => handleRemoveClick(advisor)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup for removal confirmation */}
      {deleteAdvisor && (
        <Popup open={true} onClose={() => setDeleteAdvisor(null)} position="right center">
          <div className="popup-container">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete Advisor{' '}
              <strong>{deleteAdvisor.username}</strong> with Bilkent ID{' '}
              <strong>{deleteAdvisor.bilkentId}</strong>?
            </p>
            <div className="popup-actions">
              <button onClick={handleRemoveAdvisor}>Remove</button>
              <button onClick={() => setDeleteAdvisor(null)}>Cancel</button>
            </div>
          </div>
        </Popup>
      )}

      {/* Popup for demotion confirmation */}
      {demoteAdvisor && (
        <Popup open={true} onClose={() => setDemoteAdvisor(null)} position="right center">
          <div className="popup-container">
            <h2>Confirm Demotion</h2>
            <p>
              Are you sure you want to demote Advisor{' '}
              <strong>{demoteAdvisor.username}</strong> with Bilkent ID{' '}
              <strong>{demoteAdvisor.bilkentId}</strong>?
            </p>
            <div className="popup-actions">
              <button onClick={handleDemoteAdvisor}>Demote</button>
              <button onClick={() => setDemoteAdvisor(null)}>Cancel</button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
