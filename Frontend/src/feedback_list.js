import "./feedback_list.css";
import NavbarLayout from "./navbar";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "./api/axios_config";
import Popup from "reactjs-popup";

export default function FeedbackList() {
  const { bilkentId } = useParams();
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
                <th>Event Name</th>
                <th>Event Type</th>
                <th>Date</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                  <tr key={feedback.id}>
                    <td>{feedback.eventName}</td>
                    <td>{feedback.eventType}</td>
                    <td>{feedback.date}</td>
                    <td>{feedback.rating}/5</td>
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
                  <td colSpan="5">No feedbacks available.</td>
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
                <p><strong>Event Name:</strong> {selectedFeedback.eventName}</p>
                <p><strong>Event Type:</strong> {selectedFeedback.eventType}</p>
                <p><strong>Date:</strong> {selectedFeedback.date}</p>
                <p><strong>Rating:</strong> {selectedFeedback.rating}/5</p>
                <p><strong>Number of Students:</strong> {selectedFeedback.studentCount}</p>
                <p><strong>Duration:</strong> {selectedFeedback.duration} minutes</p>
                <div className="feedback-guides">
                  <h3>Guides</h3>
                  {selectedFeedback.guides?.map((guide, index) => (
                    <p key={index}>{guide.name} - {guide.email}</p>
                  ))}
                </div>
                <div className="feedback-comments">
                  <h3>Comments</h3>
                  <p>{selectedFeedback.comments}</p>
                </div>
                <div className="feedback-notes">
                  <h3>Additional Notes</h3>
                  <p>{selectedFeedback.notes}</p>
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