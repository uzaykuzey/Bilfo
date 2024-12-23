import "./school_list.css";
import NavbarLayout from "./navbar";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "./api/axios_config";
import Popup from "reactjs-popup";

export default function SchoolList() {
  const { bilkentId } = useParams();
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [deleteSchool, setDeleteSchool] = useState(null);
  const [showFeedbacks, setShowFeedbacks] = useState(null);
  const [schoolFeedbacks, setSchoolFeedbacks] = useState([]);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await api.get("/schools/getAll");
      if (response.status === 200) {
        setSchools(response.data);
      }
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  const handleDeleteSchool = async () => {
    try {
      const response = await api.post("/schools/delete", {
        id: deleteSchool.id
      });
      if (response.status === 200) {
        setSchools(schools.filter(s => s.id !== deleteSchool.id));
        setDeleteSchool(null);
      }
    } catch (error) {
      console.error("Error deleting school:", error);
      alert("Failed to delete school");
    }
  };

  const fetchSchoolFeedbacks = async (schoolId) => {
    try {
      const response = await api.get(`/schools/${schoolId}/feedbacks`);
      if (response.status === 200) {
        setSchoolFeedbacks(response.data);
        setShowFeedbacks(schoolId);
      }
    } catch (error) {
      console.error("Error fetching school feedbacks:", error);
      alert("Failed to fetch feedbacks");
    }
  };

  return (
    <div className="home-layout">
      <NavbarLayout />
      <div className="content-list">
        <h2>School List</h2>

        <div className="table-container">
          <table className="schools-table">
            <thead>
              <tr>
                <th>School Name</th>
                <th>City</th>
                <th>District</th>
                <th>Last Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.length > 0 ? (
                schools.map((school) => (
                  <tr key={school.id}>
                    <td>{school.name}</td>
                    <td>{school.city}</td>
                    <td>{school.district}</td>
                    <td>{school.lastVisitDate}</td>
                    <td className="actions">
                      <button 
                        className="details-btn"
                        onClick={() => setSelectedSchool(school)}
                      >
                        Details
                      </button>
                      <button 
                        className="feedback-btn"
                        onClick={() => fetchSchoolFeedbacks(school.id)}
                      >
                        Feedbacks
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => setDeleteSchool(school)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No schools available.</td> {/* Adjusted colspan */}
                </tr>
              )
              }
            </tbody>
          </table>
        </div>

        {/* School Details Popup */}
        <Popup 
          open={selectedSchool !== null} 
          onClose={() => setSelectedSchool(null)}
          modal
        >
          <div className="popup-container">
            <h2>School Details</h2>
            {selectedSchool && (
              <div className="school-details">
                <p><strong>Name:</strong> {selectedSchool.name}</p>
                <p><strong>City:</strong> {selectedSchool.city}</p>
                <p><strong>District:</strong> {selectedSchool.district}</p>
                <p><strong>Address:</strong> {selectedSchool.address}</p>
                <p><strong>Last Visit:</strong> {selectedSchool.lastVisitDate}</p>
                <p><strong>Contact Person:</strong> {selectedSchool.contactPerson}</p>
                <p><strong>Contact Email:</strong> {selectedSchool.contactEmail}</p>
                <p><strong>Contact Phone:</strong> {selectedSchool.contactPhone}</p>
                <p><strong>Notes:</strong> {selectedSchool.notes}</p>
              </div>
            )}
            <div className="popup-actions">
              <button onClick={() => setSelectedSchool(null)}>Close</button>
            </div>
          </div>
        </Popup>

        {/* School Feedbacks Popup */}
        <Popup
          open={showFeedbacks !== null}
          onClose={() => setShowFeedbacks(null)}
          modal
        >
          <div className="popup-container">
            <h2>School Feedbacks</h2>
            <div className="feedback-list">
              {schoolFeedbacks.map((feedback, index) => (
                <div key={index} className="feedback-item">
                  <p><strong>Date:</strong> {feedback.date}</p>
                  <p><strong>Guide:</strong> {feedback.guideName}</p>
                  <p><strong>Rating:</strong> {feedback.rating}/5</p>
                  <p><strong>Comments:</strong> {feedback.comments}</p>
                  <hr />
                </div>
              ))}
              {schoolFeedbacks.length === 0 && (
                <p>No feedbacks available for this school.</p>
              )}
            </div>
            <div className="popup-actions">
              <button onClick={() => setShowFeedbacks(null)}>Close</button>
            </div>
          </div>
        </Popup>

        {/* Delete Confirmation Popup */}
        <Popup
          open={deleteSchool !== null}
          onClose={() => setDeleteSchool(null)}
          modal
        >
          <div className="popup-container">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete {deleteSchool?.name}?</p>
            <div className="popup-actions">
              <button onClick={handleDeleteSchool}>Delete</button>
              <button onClick={() => setDeleteSchool(null)}>Cancel</button>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  );
} 