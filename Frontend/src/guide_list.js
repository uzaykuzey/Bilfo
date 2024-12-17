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
  const [showAddPopup, setShowAddPopup] = useState(false); // Add Guide Popup visibility
  const [formError, setFormError] = useState("");

  // Fields for Add Guide Form
  const [newGuide, setNewGuide] = useState({
    username: "",
    bilkentId: "",
    email: "",
    phoneNo: "",
    department: "",
    trainee: false,
  });

  // Departments dropdown
  const departments = [
    "AMER", "ARCH", "CHEM", "COMD", "CS", "CTIS", "ECON", "EDU", "EEE", "ELIT", "FA",
    "GRA", "HART", "IAED", "IE", "IR", "LAUD", "LAW", "MAN", "MATH", "MBG", "ME",
    "MSC", "PHIL", "PHYS", "POLS", "PSYC", "THEA", "THM", "THR", "TRIN",
  ];

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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewGuide({
      ...newGuide,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Validation
  const validateForm = () => {
    const { username, bilkentId, email, phoneNo, department } = newGuide;

    if (!username || !bilkentId || !email || !phoneNo || !department) {
      return "All fields are required.";
    }
    if (!/^\d{8}$/.test(bilkentId)) {
      return "ID must be exactly 8 digits.";
    }
    if (!/^\d{10}$/.test(phoneNo)) {
      return "Phone number must be exactly 10 digits.";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Invalid email format.";
    }
    return null;
  };

  // Handle Add Guide Submission
  const handleAddGuide = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const response = await api.post("/addGuide", newGuide);
      if (response.status === 201) {
        setGuides((prev) => [...prev, response.data]);
        setShowAddPopup(false); // Close popup
        setNewGuide({
          username: "",
          bilkentId: "",
          email: "",
          phoneNo: "",
          department: "",
          trainee: false,
        });
        setFormError(""); // Clear any errors
      }
    } catch (error) {
      console.error("Error adding guide:", error);
      setFormError("Failed to add guide. Please try again.");
    }
  };

  return (
    <div className="home-layout">
      <NavbarLayout />

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
                      {/* Actions */}
                      <button className="action-btn remove-btn">Remove</button>
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
          <button
            className="add-guide-btn"
            onClick={() => setShowAddPopup(true)}
          >
            Add Guide
          </button>
        </div>

        {/* Add Guide Popup */}
        <Popup
          open={showAddPopup}
          onClose={() => setShowAddPopup(false)}
          modal
          closeOnDocumentClick
          contentStyle={{
            width: "400px",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          <div>
            <h2>Add Guide</h2>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="username"
                value={newGuide.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>ID:</label>
              <input
                type="text"
                name="bilkentId"
                value={newGuide.bilkentId}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={newGuide.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNo"
                value={newGuide.phoneNo}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Department:</label>
              <select
                name="department"
                value={newGuide.department}
                onChange={handleInputChange}
              >
                <option value="">--Select Department--</option>
                {departments.map((dept, idx) => (
                  <option key={idx} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>
                Trainee:
                <input
                  type="checkbox"
                  name="trainee"
                  checked={newGuide.trainee}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            {formError && <p style={{ color: "red" }}>{formError}</p>}
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleAddGuide}>
                Add
              </button>
              <button className="cancel-btn" onClick={() => setShowAddPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  );
}
