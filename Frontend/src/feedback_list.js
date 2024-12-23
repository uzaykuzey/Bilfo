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
  const [filterSchool, setFilterSchool] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get("/feedbacks/getAll");
      if (response.status === 200) {
        setFeedbacks(response.data);
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSchool = feedback.schoolName.toLowerCase().includes(filterSchool.toLowerCase());
    const matchesDate = !filterDate || feedback.date.includes(filterDate);
    return matchesSchool && matchesDate;
  });

  return (
    <div className="home-layout">
      <NavbarLayout />
      <div className="content-list">
        <h2>Feedback List</h2>

        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Filter by school name..."
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
            />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>School</th>
                <th>Date</th>
                <th>Guide</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((feedback) => (
                <tr key={feedback.id}>
                  <td>{feedback.schoolName}</td>
                  <td>{feedback.date}</td>
                  <td>{feedback.guideName}</td>
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
              ))}
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
                <p><strong>School:</strong> {selectedFeedback.schoolName}</p>
                <p><strong>Date:</strong> {selectedFeedback.date}</p>
                <p><strong>Guide:</strong> {selectedFeedback.guideName}</p>
                <p><strong>Rating:</strong> {selectedFeedback.rating}/5</p>
                <p><strong>Number of Students:</strong> {selectedFeedback.studentCount}</p>
                <p><strong>Duration:</strong> {selectedFeedback.duration} minutes</p>
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