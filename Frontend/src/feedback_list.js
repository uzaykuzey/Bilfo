import "./feedback_list.css";
import NavbarLayout from "./navbar";
import { useParams, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "./api/axios_config";
import Popup from "reactjs-popup";

export default function FeedbackList() {
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get("/event/getAllFeedbacks");
      if (response.status === 200) {
        setFeedbacks(response.data);
        console.log("Feedbacks fetched:", response.data);
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  return (
    <div className="home-layout">
      <NavbarLayout />
      <div className="content-list">
        <h2>Feedback List</h2>

        <div className="table-container">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>School Name</th>
                <th>Event Type</th>
                <th>Date</th>
                <th>Rating</th>
                <th>Visitor Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                  <tr key={feedback.id}>
                    <td>
                      {feedback.second?.type !== "INDIVIDUAL_TOUR"
                        ? feedback.second?.schoolName || "N/A"
                        : feedback.second?.names
                        ? feedback.second.names[0]
                        : "N/A"}
                    </td>

                    <td>{feedback.first?.eventType || "N/A"}</td>
                    <td>{feedback.first?.date
                      ? new Date(feedback.first.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "N/A"}</td>
                    <td>{feedback.third?.rate || "No rating"}/10</td>
                    <td>{feedback.second?.visitorCount || 0}</td>
                    <td>
                      <button 
                        className="details-btn"
                        onClick={() => setSelectedFeedback(feedback)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No feedbacks available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Feedback Details Popup */}
        <Popup 
          open={selectedFeedback !== null} 
          onClose={() => setSelectedFeedback(null)}
          modal
        >
          <div className="popup-container">
            <h2>Feedback Details</h2>
            {selectedFeedback && (
              <div className="feedback-details">
                <p>
                    <strong>School Name:</strong>{" "}
                    {selectedFeedback.second?.type !== "INDIVIDUAL_TOUR"
                      ? selectedFeedback.second?.schoolName || "N/A"
                      : selectedFeedback.second?.names
                      ? selectedFeedback.second.names[0]
                      : "N/A"}
                  </p>

                <p><strong>Event Type:</strong> {selectedFeedback.first?.eventType || "N/A"}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {selectedFeedback.first?.date
                    ? new Date(selectedFeedback.first.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
                <p><strong>Rating:</strong> {selectedFeedback.third?.rate || "No rating"}/10</p>
                <p><strong>Experience:</strong> {selectedFeedback.third?.experience || "N/A"}</p>
                <p><strong>Visitor Count:</strong> {selectedFeedback.second?.visitorCount || 0}</p>
                <p><strong>Visitor Notes:</strong> {selectedFeedback.second?.visitorNotes || "None"}</p>
                <p><strong>City:</strong> {selectedFeedback.second?.city || "N/A"}</p>
                <p><strong>District:</strong> {selectedFeedback.second?.district || "N/A"}</p>
                <div className="feedback-comments">
                  <h3>Comments</h3>
                  <p>{selectedFeedback.third?.recommendations || "No comments"}</p>
                </div>
              </div>
            )}
            <div className="popup-actions">
              <button onClick={() => setSelectedFeedback(null)}>Close</button>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  );
}
