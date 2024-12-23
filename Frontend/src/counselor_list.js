import "./counselor_list.css";
import NavbarLayout from "./navbar";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "./api/axios_config";
import Popup from "reactjs-popup";

export default function CounselorList() {
  const { bilkentId } = useParams();
  const [counselors, setCounselors] = useState([]);
  const [editCounselor, setEditCounselor] = useState(null);
  const [deleteCounselor, setDeleteCounselor] = useState(null);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    school: ""
  });

  const [newCounselor, setNewCounselor] = useState({
    name: "",
    email: "",
    phoneNo: "",
    school: ""
  });

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const response = await api.get("/counselors/getAll");
      if (response.status === 200) {
        setCounselors(response.data);
      }
    } catch (err) {
      console.error("Error fetching counselors:", err);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await api.post("/counselors/edit", editForm);
      if (response.status === 200) {
        await fetchCounselors();
        setEditCounselor(null);
      }
    } catch (error) {
      console.error("Error editing counselor:", error);
      alert("Failed to edit counselor");
    }
  };

  const handleDeleteCounselor = async () => {
    try {
      const response = await api.post("/counselors/delete", {
        id: deleteCounselor.id
      });
      if (response.status === 200) {
        setCounselors(counselors.filter(c => c.id !== deleteCounselor.id));
        setDeleteCounselor(null);
      }
    } catch (error) {
      console.error("Error deleting counselor:", error);
      alert("Failed to delete counselor");
    }
  };

  const handleAddCounselor = async () => {
    try {
      const response = await api.post("/counselors/add", newCounselor);
      if (response.status === 200) {
        await fetchCounselors();
        setIsAddPopupOpen(false);
        setNewCounselor({
          name: "",
          email: "",
          phoneNo: "",
          school: ""
        });
      }
    } catch (error) {
      console.error("Error adding counselor:", error);
      alert("Failed to add counselor");
    }
  };

  return (
    <div className="home-layout">
      <NavbarLayout />
      <div className="content-list">
        <h2>Counselor List</h2>
        <button className="add-btn" onClick={() => setIsAddPopupOpen(true)}>
          Add Counselor
        </button>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>School</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {counselors.map((counselor) => (
                <tr key={counselor.id}>
                  <td>{counselor.name}</td>
                  <td>{counselor.email}</td>
                  <td>{counselor.phoneNo}</td>
                  <td>{counselor.school}</td>
                  <td className="actions">
                    <button 
                      className="edit-btn"
                      onClick={() => {
                        setEditCounselor(counselor);
                        setEditForm({
                          id: counselor.id,
                          name: counselor.name,
                          email: counselor.email,
                          phoneNo: counselor.phoneNo,
                          school: counselor.school
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => setDeleteCounselor(counselor)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Popup */}
        <Popup 
          open={editCounselor !== null} 
          onClose={() => setEditCounselor(null)}
          modal
        >
          <div className="popup-container">
            <h2>Edit Counselor</h2>
            <div className="input-group">
              <label>Name:</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Phone:</label>
              <input
                type="tel"
                value={editForm.phoneNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setEditForm({...editForm, phoneNo: value});
                }}
              />
            </div>
            <div className="input-group">
              <label>School:</label>
              <input
                type="text"
                value={editForm.school}
                onChange={(e) => setEditForm({...editForm, school: e.target.value})}
              />
            </div>
            <div className="popup-actions">
              <button onClick={handleEditSubmit}>Save</button>
              <button onClick={() => setEditCounselor(null)}>Cancel</button>
            </div>
          </div>
        </Popup>

        {/* Delete Confirmation Popup */}
        <Popup
          open={deleteCounselor !== null}
          onClose={() => setDeleteCounselor(null)}
          modal
        >
          <div className="popup-container">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete {deleteCounselor?.name}?</p>
            <div className="popup-actions">
              <button onClick={handleDeleteCounselor}>Delete</button>
              <button onClick={() => setDeleteCounselor(null)}>Cancel</button>
            </div>
          </div>
        </Popup>

        {/* Add Counselor Popup */}
        <Popup
          open={isAddPopupOpen}
          onClose={() => setIsAddPopupOpen(false)}
          modal
        >
          <div className="popup-container">
            <h2>Add Counselor</h2>
            <div className="input-group">
              <label>Name:</label>
              <input
                type="text"
                value={newCounselor.name}
                onChange={(e) => setNewCounselor({...newCounselor, name: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                value={newCounselor.email}
                onChange={(e) => setNewCounselor({...newCounselor, email: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Phone:</label>
              <input
                type="tel"
                value={newCounselor.phoneNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setNewCounselor({...newCounselor, phoneNo: value});
                }}
              />
            </div>
            <div className="input-group">
              <label>School:</label>
              <input
                type="text"
                value={newCounselor.school}
                onChange={(e) => setNewCounselor({...newCounselor, school: e.target.value})}
              />
            </div>
            <div className="popup-actions">
              <button onClick={handleAddCounselor}>Save</button>
              <button onClick={() => setIsAddPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  );
} 