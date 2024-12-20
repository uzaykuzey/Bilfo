import "./guide_list.css";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import api from "./api/axios_config";
import NavbarLayout from "./navbar";

export default function GuideListLayout() {
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const { statusUser } = state;
  const navigate = useNavigate();

  const [guides, setGuides] = useState([]);
  const [error, setError] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [formError, setFormError] = useState("");
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [showPromotePopup, setShowPromotePopup] = useState(false);
  const [showDemotePopup, setShowDemotePopup] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");

  const [newGuide, setNewGuide] = useState({
    username: "",
    bilkentId: "",
    email: "",
    phoneNo: "",
    department: "",
    trainee: false,
  });

  const departments = [
    "AMER", "ARCH", "CHEM", "COMD", "CS", "CTIS", "ECON", "EDU", "EEE", "ELIT", "FA",
    "GRA", "HART", "IAED", "IE", "IR", "LAUD", "LAW", "MAN", "MATH", "MBG", "ME",
    "MSC", "PHIL", "PHYS", "POLS", "PSYC", "THEA", "THM", "THR", "TRIN",
  ];

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await api.get("/getGuides");
        if (response.status === 200) {
          setGuides(response.data);
        } else if (response.status === 204) {
          setGuides([]);
        }
      } catch (err) {
        console.error("Error fetching guides:", err);
        setError("An error occurred while fetching guides.");
      }
    };
    fetchGuides();
  }, []);

  const handlePromoteGuide = async () => {
    try {
      setError("");
      setFormError("");
      let response
      if(!selectedGuide.trainee){
        response = await api.post("/promoteUser", { 
          bilkentId: selectedGuide.bilkentId, 
          day: selectedDay 
        });
      }else{
        response = await api.post("/promoteUser", { 
          bilkentId: selectedGuide.bilkentId, 
        });
      }
      if (response.status === 200) {
        setShowPromotePopup(false);
        setSelectedGuide(null);
        setSelectedDay("");
      }
    } catch (error) {
      console.error("Error promoting guide:", error);
      setError("Failed to promote guide. Please try again.");
    }
  };

  const handleDemoteGuide = async () => {
    try {
      console.log(selectedGuide.bilkentId);
      const response = await api.post("/demoteUser", { bilkentId: selectedGuide.bilkentId });
      if (response.status === 200) {
        setShowDemotePopup(false);
        setSelectedGuide(null);
      }
    } catch (error) {
      console.error("Error demoting guide:", error);
      setError("Failed to demote guide. Please try again.");
    }
  };

  const handleRemoveGuide = async () => {
    try {
      const response = await api.post("/removeGuide", { bilkentId: selectedGuide.bilkentId });
      if (response.status === 200) {
        setGuides((prev) => prev.filter((guide) => guide.bilkentId !== selectedGuide.bilkentId));
        setShowRemovePopup(false);
        setSelectedGuide(null);
      }
    } catch (error) {
      console.error("Error removing guide:", error);
      setError("Failed to remove guide. Please try again.");
    }
  };

  return (
    <div className="home-layout">
      <NavbarLayout />

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
              <th>Trainee</th> {/* New column header */}
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
                  <td>{guide.trainee ? "Yes" : "No"}</td> {/* New column data */}
                  <td>
                    <button
                      className="action-btn promote-btn"
                      onClick={() => {
                        setSelectedGuide(guide);
                        setShowPromotePopup(true);
                      }}
                    >
                      Promote
                    </button>
                    <button
                      className="action-btn demote-btn"
                      onClick={() => {
                        setSelectedGuide(guide);
                        setShowDemotePopup(true);
                      }}
                    >
                      Demote
                    </button>
                    <button
                      className="action-btn remove-btn"
                      onClick={() => {
                        setSelectedGuide(guide);
                        setShowRemovePopup(true);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No guides available.</td> {/* Adjusted colspan */}
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
        >
          <div className="add-guide-popup">
            <h2>Add Guide</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const data = {
                    username: newGuide.username,
                    bilkentId: newGuide.bilkentId,
                    email: newGuide.email,
                    phoneNo: newGuide.phoneNo,
                    department: newGuide.department,
                    trainee: newGuide.trainee,
                  };
                  const response = await api.post("/addGuide", data);
                  if (response.status === 200) {
                    setGuides([...guides, response.data]);
                    setShowAddPopup(false);
                    setNewGuide({
                      username: "",
                      bilkentId: "",
                      email: "",
                      phoneNo: "",
                      department: "",
                      trainee: false,
                    });
                  }
                } catch (err) {
                  console.error("Error adding guide:", err);
                  setFormError("Failed to add guide. Please try again.");
                }
              }}
            >
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={newGuide.username}
                  onChange={(e) =>
                    setNewGuide({ ...newGuide, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>ID:</label>
                <input
                  type="text"
                  value={newGuide.bilkentId}
                  onChange={(e) =>
                    setNewGuide({ ...newGuide, bilkentId: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>E-mail:</label>
                <input
                  type="email"
                  value={newGuide.email}
                  onChange={(e) =>
                    setNewGuide({ ...newGuide, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  value={newGuide.phoneNo}
                  onChange={(e) =>
                    setNewGuide({ ...newGuide, phoneNo: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Department:</label>
                <select
                  value={newGuide.department}
                  onChange={(e) =>
                    setNewGuide({ ...newGuide, department: e.target.value })
                  }
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newGuide.trainee}
                    onChange={(e) =>
                      setNewGuide({ ...newGuide, trainee: e.target.checked })
                    }
                  />
                  Trainee
                </label>
              </div>
              {formError && <p style={{ color: "red" }}>{formError}</p>}
              <div className="popup-buttons">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Popup>

        {/* Remove Confirmation Popup */}
        <Popup
          open={showRemovePopup}
          onClose={() => setShowRemovePopup(false)}
          modal
          closeOnDocumentClick
        >
          <div>
            <h2>Confirm Removal</h2>
            <p>
              Are you sure you want to remove{" "}
              <strong>{selectedGuide?.username}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleRemoveGuide}>
                Remove
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowRemovePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Popup>

        {/* Promote Confirmation Popup */}
        <Popup
          open={showPromotePopup}
          onClose={() => setShowPromotePopup(false)}
          modal
          closeOnDocumentClick
        >
          <div>
            <h2>Confirm Promotion</h2>
            <p>
              Are you sure you want to promote{" "}
              <strong>{selectedGuide?.username}</strong>?
            </p>
            {!selectedGuide?.trainee && ( // Conditional check for trainee
              <div className="form-group">
                <label>Day of Promotion:</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  required
                >
                  <option value="">Select Day</option>
                  {daysOfWeek.map((day, index) => (
                    <option key={index} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handlePromoteGuide}>
                Promote
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowPromotePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Popup>

        {/* Demote Confirmation Popup */}
        <Popup
          open={showDemotePopup}
          onClose={() => setShowDemotePopup(false)}
          modal
          closeOnDocumentClick
        >
          <div>
            <h2>Confirm Demotion</h2>
            <p>
              Are you sure you want to demote{" "}
              <strong>{selectedGuide?.username}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleDemoteGuide}>
                Demote
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowDemotePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  );
}
