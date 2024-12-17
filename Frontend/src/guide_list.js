import "./guide_list.css";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Popup from 'reactjs-popup';
import api from "./api/axios_config";
import NavbarLayout from "./navbar";

export default function GuideListLayout() {
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const { statusUser } = state;
  const navigate = useNavigate();

  const [guides, setGuides] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false); // To manage popup visibility
  const [selectedGuideId, setSelectedGuideId] = useState(null); // Store the selected guide's ID
  const [selectedDay, setSelectedDay] = useState(""); // Store the selected day for promotion

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

  
  const handlePromote = (id) => {
    setSelectedGuideId(id); // Set the guide to be promoted
    setShowPopup(true); // Show the popup when promote button is clicked
  };

  const handlePopupClose = () => {
    setShowPopup(false); // Close the popup
    setSelectedGuideId(null); // Reset selected guide ID
    setSelectedDay(""); // Reset selected day
  };

  const handleConfirmPromotion = async () => {
    if (selectedGuideId && selectedDay) {
      try {
        const response = await api.post("/promoteUser", {
          bilkentId: selectedGuideId,
          day: selectedDay, // Pass the selected day to the API
        });
        console.log("Promotion successful:", response.data);
        handlePopupClose(); // Close the popup after successful promotion
        goToGuideList();
      } catch (error) {
        console.error("Error promoting guide:", error);
        handlePopupClose(); // Close the popup even if promotion fails
      }
    }
  };

  const handleRemove = (id) => {
    // Logic for removing guide
  };

  const handleLogs = (id) => {
    // Logic for viewing logs
  };

  return (
    <div className="home-layout">
      <NavbarLayout/>

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
                      {(statusUser !== "ADVISOR" && statusUser !== "GUIDE") && (
                        <button
                          className="action-btn promote-btn"
                          onClick={() => handlePromote(guide.bilkentId)}
                        >
                          Promote
                        </button>
                      )}
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

        {/* Popup for Promotion Confirmation */}
        <Popup
          open={showPopup}
          onClose={handlePopupClose}
          position="right center"
          contentStyle={{ width: "400px", padding: "20px", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
        >
          <div className="popup-content">
            <h3>Are you sure you want to promote this guide?</h3>
            <div className="day-selection">
              <label>Select Day:</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="day-select"
              >
                <option value="">--Select a day--</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmPromotion}>
                Yes
              </button>
              <button className="cancel-btn" onClick={handlePopupClose}>
                Cancel
              </button>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  );
}
