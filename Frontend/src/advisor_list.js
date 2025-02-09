import "./advisor_list.css";
import NavbarLayout from "./navbar";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "./api/axios_config";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function AdvisorListLayout() {
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { statusUser } = state;

  const [advisors, setAdvisors] = useState([]);
  const [deleteAdvisor, setDeleteAdvisor] = useState(null);
  const [demoteAdvisor, setDemoteAdvisor] = useState(null);
  const [promoteAdvisor, setPromoteAdvisor] = useState(null);

  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [newAdvisor, setNewAdvisor] = useState({
    username: "",
    bilkentId: "",
    email: "",
    phoneNo: "",
    department: "CS",
    day: "Monday",
    status: "ADVISOR"
  });

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
        console.error("Error fetching advisors:", err);
      }
    };

    fetchAdvisors();
  }, []);

  const handleRemoveClick = (advisor) => setDeleteAdvisor(advisor);

  const handleRemoveAdvisor = async () => {
    if (deleteAdvisor) {
      try {
        const response = await api.post(`/removeUser`, { bilkentId: deleteAdvisor.bilkentId });
        if (response.status === 200) {
          setAdvisors(advisors.filter((a) => a.id !== deleteAdvisor.id));
          setDeleteAdvisor(null);
        }
      } catch (error) {
        console.error("Error removing advisor:", error);
      }
    }
  };

  const handleDemoteClick = (advisor) => setDemoteAdvisor(advisor);

  const handleDemoteAdvisor = async () => {
    if (demoteAdvisor) {
      try {
        const response = await api.post(`/demoteUser`, { bilkentId: demoteAdvisor.bilkentId });
        if (response.status === 200) {
          setAdvisors(
            advisors.map((advisor) =>
              advisor.id === demoteAdvisor.id ? { ...advisor, role: "USER" } : advisor
            )
          );
          setDemoteAdvisor(null);
        }
      } catch (error) {
        console.error("Error demoting advisor:", error);
      }
    }
  };

  const handlePromoteClick = (advisor) => setPromoteAdvisor(advisor);

  const handlePromoteAdvisor = async () => {
    if (promoteAdvisor) {
      try {
        const response = await api.post(`/promoteUser`, { bilkentId: promoteAdvisor.bilkentId});
        if (response.status === 200) {
          setAdvisors(
            advisors.map((advisor) =>
              advisor.id === promoteAdvisor.id ? { ...advisor, role: "SENIOR_ADVISOR" } : advisor
            )
          );
          setPromoteAdvisor(null);
        }
      } catch (error) {
        console.error("Error promoting advisor:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdvisor({ ...newAdvisor, [name]: value });
  };

  const isFormValid = () => {
    const { username, bilkentId, email, phoneNo } = newAdvisor;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const idRegex = /^\d{8}$/;

    if (!username || !bilkentId || !email || !phoneNo) return false;
    if (!idRegex.test(bilkentId)) return false;
    if (!emailRegex.test(email)) return false;
    if (!phoneRegex.test(phoneNo)) return false;
    return true;
  };

  const handleAddAdvisor = async () => {
    if (!isFormValid()) {
      alert("Please fill in all fields correctly. ID must be 8 digits, email must be valid, and phone must be 10 digits.");
      return;
    }
    try {
      const response = await api.post("/addAdvisor", newAdvisor);
      if (response.status === 200) {
        setAdvisors([...advisors, response.data]);
        setIsAddPopupOpen(false);
        setNewAdvisor({
          username: "",
          bilkentId: "",
          email: "",
          phoneNo: "",
          department: "CS",
          day: "Monday"
        });
      }
    } catch (error) {
      console.error("Error adding advisor:", error);
    }
  };

  return (
    <div className="home-layout">
      <NavbarLayout />
      <div className="content-alist">
        <h2 id = "advisor-list-header">Advisor List</h2>
        <button className="add-advisor-btn" onClick={() => setIsAddPopupOpen(true)}>
            Add Advisor
          </button>
        <div className="advisor-list">

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
              {advisors.length > 0 ? (
                advisors.map((advisor) => (
                  <tr key={advisor.id}>
                    <td>{advisor.username}</td>
                    <td>{advisor.email}</td>
                    <td>{advisor.bilkentId}</td>
                    <td className="actions">
                      <button onClick={() => handlePromoteClick(advisor)}>Promote</button>
                      <button onClick={() => handleDemoteClick(advisor)}>Demote</button>
                      <button onClick={() => handleRemoveClick(advisor)}>Remove</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No advisors available.</td> {/* Adjusted colspan */}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promote Popup */}
      {promoteAdvisor && (
        <Popup open={true} onClose={() => setPromoteAdvisor(null)} position="center center">
          <div className="popup-content">
          <div className="popup-container">
            <h2>Confirm Promotion</h2>
            <p>
              Are you sure you want to promote <strong>{promoteAdvisor.username}</strong> to Senior Advisor?
            </p>
            <div className="popup-actions">
              <button onClick={handlePromoteAdvisor}>Promote</button>
              <button onClick={() => setPromoteAdvisor(null)}>Cancel</button>
            </div>
            </div>
          </div>
        </Popup>
      )}

      {/* Demote Popup */}
      {demoteAdvisor && (
        <Popup open={true} onClose={() => setDemoteAdvisor(null)} position="center center">
          <div className="popup-content">
          <div className="popup-container">
            <h2>Confirm Demotion</h2>
            <p>
              Are you sure you want to demote <strong>{demoteAdvisor.username}</strong>?
            </p>
            <div className="popup-actions">
              <button onClick={handleDemoteAdvisor}>Demote</button>
              <button onClick={() => setDemoteAdvisor(null)}>Cancel</button>
            </div>
            </div>
          </div>
        </Popup>
      )}

      {/* Remove Popup */}
      {deleteAdvisor && (
        <Popup open={true} onClose={() => setDeleteAdvisor(null)} position="center center">
          <div className="popup-content">
          <div className="popup-container">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to remove <strong>{deleteAdvisor.username}</strong>?
            </p>
            <div className="popup-actions">
              <button onClick={handleRemoveAdvisor}>Remove</button>
              <button onClick={() => setDeleteAdvisor(null)}>Cancel</button>
            </div>
            </div>
          </div>
        </Popup>
      )}

      {/* Add Advisor Popup */}
      {isAddPopupOpen && (
        <Popup open={true} onClose={() => setIsAddPopupOpen(false)} position="center center">
          <div className="popup-content">
          <div className="popup-container">
            <h2>Add Advisor</h2>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="username"
                value={newAdvisor.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>ID:</label>
              <input
                type="text"
                name="bilkentId"
                value={newAdvisor.bilkentId}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>E-mail:</label>
              <input
                type="email"
                name="email"
                value={newAdvisor.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="text"
                name="phoneNo"
                value={newAdvisor.phoneNo}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Department:</label>
              <select
                name="department"
                value={newAdvisor.department}
                onChange={handleChange}
              >
                <option value="AMER">AMER</option>
                <option value="ARCH">ARCH</option>
                <option value="CHEM">CHEM</option>
                <option value="COMD">COMD</option>
                <option value="CS">CS</option>
                <option value="CTIS">CTIS</option>
                <option value="ECON">ECON</option>
                <option value="EDU">EDU</option>
                <option value="EEE">EEE</option>
                <option value="ELIT">ELIT</option>
                <option value="FA">FA</option>
                <option value="GRA">GRA</option>
                <option value="HART">HART</option>
                <option value="IAED">IAED</option>
                <option value="IE">IE</option>
                <option value="IR">IR</option>
                <option value="LAUD">LAUD</option>
                <option value="LAW">LAW</option>
                <option value="MAN">MAN</option>
                <option value="MATH">MATH</option>
                <option value="MBG">MBG</option>
                <option value="ME">ME</option>
                <option value="MSC">MSC</option>
                <option value="PHIL">PHIL</option>
                <option value="PHYS">PHYS</option>
                <option value="POLS">POLS</option>
                <option value="PSYC">PSYC</option>
                <option value="THEA">THEA</option>
                <option value="THM">THM</option>
                <option value="THR">THR</option>
                <option value="TRIN">TRIN</option>
              </select>
            </div>
            <div className="form-group">
              <label>Day Of the Advisor:</label>
              <select
                name="day"
                value={newAdvisor.day}
                onChange={handleChange}
              ><option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>

              </select>
              </div>
            <div className="popup-actions">
              <button onClick={handleAddAdvisor}>Save</button>
              <button onClick={() => setIsAddPopupOpen(false)}>Cancel</button>
            </div>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
