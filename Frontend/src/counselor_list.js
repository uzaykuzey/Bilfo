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
    school: "",
    city: "",
    district: ""
  });

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [schoolsList, setSchoolsList] = useState([]);

  useEffect(() => {
    fetchCounselors();
  }, []);

  useEffect(() => {
    if (newCounselor.city) {
      fetchDistricts();
    }
  }, [newCounselor.city]);

  useEffect(() => {
    if (newCounselor.city && newCounselor.district) {
      fetchSchools();
    }
  }, [newCounselor.district]);

  const fetchCounselors = async () => {
    try {
      const response = await api.get("/counselor/getAll");
      if (response.status === 200) {
        setCounselors(response.data);
      }
    } catch (err) {
      console.error("Error fetching counselors:", err);
    }
  };

  const fetchCities = async () => {
    try {
      console.log("Fetching cities...");
      const response = await api.get("/school/cityNames");
      console.log("Cities received:", response.data);
      setCities(response.data);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  };

  const fetchDistricts = async () => {
    try {
      console.log("Fetching districts for city:", newCounselor.city);
      const response = await api.get(`/school/districtNames?city=${newCounselor.city}`);
      console.log("Districts received:", response.data);
      setDistricts(response.data);
      setNewCounselor(prev => ({ ...prev, district: '', school: '' }));
    } catch (error) {
      console.error("Failed to fetch districts:", error);
    }
  };

  const fetchSchools = async () => {
    try {
      console.log("Fetching schools for city:", newCounselor.city, "and district:", newCounselor.district);
      const response = await api.get(`/school/schoolNames?city=${newCounselor.city}&district=${newCounselor.district}`);
      console.log("Schools received:", response.data);
      setSchoolsList(response.data);
      setNewCounselor(prev => ({ ...prev, school: '' }));
    } catch (error) {
      console.error("Failed to fetch schools:", error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await api.post("/counselor/edit", editForm);
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
      console.log("Attempting to delete counselor with ID:", deleteCounselor.id);
      const response = await api.post("/counselor/delete", {
        id: deleteCounselor.id
      });
      console.log("Delete response:", response);
      if (response.status === 200) {
        setCounselors(counselors.filter(c => c.id !== deleteCounselor.id));
        setDeleteCounselor(null);
      }
    } catch (error) {
      console.error("Error deleting counselor:", error);
      console.error("Error response:", error.response);
      alert("Failed to delete counselor: " + (error.response?.data || error.message));
    }
  };

  const handleAddCounselor = async () => {
    try {
        if (!newCounselor.name || !newCounselor.email || !newCounselor.phoneNo || !newCounselor.school) {
            alert("Please fill in all fields");
            return;
        }

        const counselorData = {
            name: newCounselor.name,
            email: newCounselor.email,
            phoneNo: newCounselor.phoneNo,
            school: newCounselor.school
        };

        const response = await api.post("/counselor/add", counselorData);

        if (response.status === 200) {
            await fetchCounselors();
            setIsAddPopupOpen(false);
            setNewCounselor({
                name: "",
                email: "",
                phoneNo: "",
                school: "",
                city: "",
                district: ""
            });
        }
    } catch (error) {
        alert("Failed to add counselor. Email might already exist.");
    }
  };

  const handleAddPopupOpen = async () => {
    try {
        await fetchCities(); // Fetch cities when opening the popup
        setIsAddPopupOpen(true);
    } catch (error) {
        console.error("Error fetching initial data:", error);
    }
  };

  return (
    <div className="home-layout">
      <NavbarLayout />
      <div className="content-list">
        <h2>Counselor List</h2>
        <button className="add-btn" onClick={handleAddPopupOpen}>
          Add Counselor
        </button>

        <div className="table-container">
          <table className="counselor-table">
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
              <label>City:</label>
              <select
                value={newCounselor.city}
                onChange={(e) => setNewCounselor({...newCounselor, city: e.target.value})}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>District:</label>
              <select
                value={newCounselor.district}
                onChange={(e) => setNewCounselor({...newCounselor, district: e.target.value})}
                disabled={!newCounselor.city}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>School:</label>
              <select
                value={newCounselor.school}
                onChange={(e) => setNewCounselor({...newCounselor, school: e.target.value})}
                disabled={!newCounselor.district}
              >
                <option value="">Select School</option>
                {schoolsList.map((school) => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
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