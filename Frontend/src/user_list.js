import "./user_list.css";
import NavbarLayout from "./navbar";
import { useParams, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "./api/axios_config";
import Popup from "reactjs-popup";

export default function UserList() {
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const { statusUser } = state;

  const [users, setUsers] = useState([]);
  const [deleteUser, setDeleteUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [promoteUser, setPromoteUser] = useState(null);
  const [demoteUser, setDemoteUser] = useState(null);
  
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    phoneNo: "",
    bilkentId: "",
  });

  const [newUser, setNewUser] = useState({
    username: "",
    bilkentId: "",
    email: "",
    phoneNo: "",
    department: "CS",
    status: "GUIDE"
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/getAllUsers");
        if (response.status === 200) {
          setUsers(response.data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      phoneNo: user.phoneNo,
      bilkentId: user.bilkentId,
    });
  };

  const handleEditSubmit = async () => {
    if (!editUser) return;

    // Validate the form data
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const idRegex = /^\d{8}$/;

    if (!editForm.username || 
        !emailRegex.test(editForm.email) || 
        !phoneRegex.test(editForm.phoneNo) || 
        !idRegex.test(editForm.bilkentId)) {
      alert("Please fill all fields correctly:\n- ID must be 8 digits\n- Email must be valid\n- Phone must be 10 digits");
      return;
    }

    try {
      // Log the request data for debugging
      console.log("Sending edit request with data:", {
        bilkentId: parseInt(editForm.bilkentId),
        username: editForm.username,
        email: editForm.email,
        phoneNo: editForm.phoneNo
      });

      const response = await api.post("/editUser", {
        bilkentId: parseInt(editForm.bilkentId), // Convert to number as backend expects
        username: editForm.username,
        email: editForm.email,
        phoneNo: editForm.phoneNo
      });

      if (response.status === 200) {
        // Refresh the user list from server instead of updating locally
        const updatedUsers = await api.get("/getAllUsers");
        setUsers(updatedUsers.data);
        
        // Close the popup and reset form
        setEditUser(null);
        setEditForm({
          username: "",
          email: "",
          phoneNo: "",
          bilkentId: ""
        });
      }
    } catch (error) {
      console.error("Error editing user:", error);
      // More detailed error message
      alert(`Failed to edit user: ${error.response?.data || error.message}`);
    }
  };

  const handleRemoveClick = (user) => setDeleteUser(user);

  const handleRemoveUser = async () => {
    if (deleteUser) {
      try {
        const response = await api.post("/removeUser", { bilkentId: deleteUser.bilkentId });
        if (response.status === 200) {
          setUsers(users.filter((u) => u.bilkentId !== deleteUser.bilkentId));
          setDeleteUser(null);
        }
      } catch (error) {
        console.error("Error removing user:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const isFormValid = () => {
    const { username, bilkentId, email, phoneNo } = newUser;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const idRegex = /^\d{8}$/;

    return username && 
           idRegex.test(bilkentId) && 
           emailRegex.test(email) && 
           phoneRegex.test(phoneNo);
  };

  const handleAddUser = async () => {
    if (!isFormValid()) {
      alert("Please fill in all fields correctly. ID must be 8 digits, email must be valid, and phone must be 10 digits.");
      return;
    }
    try {
      const response = await api.post("/create", newUser);
      if (response.status === 201) {
        setUsers([...users, response.data]);
        setIsAddPopupOpen(false);
        setNewUser({
          username: "",
          bilkentId: "",
          email: "",
          phoneNo: "",
          department: "CS",
          status: "GUIDE"
        });
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handlePromoteClick = (user) => setPromoteUser(user);
  const handleDemoteClick = (user) => setDemoteUser(user);

  const handlePromoteUser = async () => {
    if (promoteUser) {
      try {
        const response = await api.post("/promoteUser", {
          bilkentId: promoteUser.bilkentId
        });
        if (response.status === 200) {
          // Refresh the user list after promotion
          const updatedUsers = await api.get("/getAllUsers");
          setUsers(updatedUsers.data);
          setPromoteUser(null);
        }
      } catch (error) {
        console.error("Error promoting user:", error);
      }
    }
  };

  const handleDemoteUser = async () => {
    if (demoteUser) {
      try {
        const response = await api.post("/demoteUser", {
          bilkentId: demoteUser.bilkentId
        });
        if (response.status === 200) {
          // Refresh the user list after demotion
          const updatedUsers = await api.get("/getAllUsers");
          setUsers(updatedUsers.data);
          setDemoteUser(null);
        }
      } catch (error) {
        console.error("Error demoting user:", error);
      }
    }
  };

  return (
    <div className="home-layout">
      <NavbarLayout />
      <div className="content-list">
        <h2 id="user-list-header">User List</h2>
        <button className="add-user-btn" onClick={() => setIsAddPopupOpen(true)}>
          Add User
        </button>

        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>E-mail</th>
                <th>ID</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.bilkentId}</td>
                  <td>{user.status}</td>
                  <td className="actions">
                    <button 
                      className="promote-btn"
                      onClick={() => handlePromoteClick(user)}
                    >
                      Promote
                    </button>
                    <button 
                      className="demote-btn"
                      onClick={() => handleDemoteClick(user)}
                    >
                      Demote
                    </button>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveClick(user)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Popup */}
      <Popup 
        open={editUser !== null} 
        onClose={() => setEditUser(null)} 
        modal
        closeOnDocumentClick
      >
        <div className="popup-container">
          <h2>Edit User</h2>
          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              value={editForm.username}
              onChange={(e) => setEditForm({...editForm, username: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>ID:</label>
            <input
              type="text"
              value={editForm.bilkentId}
              onChange={(e) => setEditForm({...editForm, bilkentId: e.target.value})}
              pattern="\d{8}"
              title="ID must be 8 digits"
            />
          </div>
          <div className="input-group">
            <label>E-mail:</label>
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
              pattern="\d{10}"
              title="Phone number must be 10 digits"
            />
          </div>
          <div className="popup-actions">
            <button onClick={handleEditSubmit}>Save</button>
            <button onClick={() => setEditUser(null)}>Cancel</button>
          </div>
        </div>
      </Popup>

      {/* Promote Confirmation Popup */}
      <Popup
        open={promoteUser !== null}
        onClose={() => setPromoteUser(null)}
        modal
        closeOnDocumentClick
      >
        <div className="popup-container">
          <h2>Confirm Promotion</h2>
          <p>
            Are you sure you want to promote <strong>{promoteUser?.username}</strong>?
          </p>
          <div className="popup-actions">
            <button onClick={handlePromoteUser}>Promote</button>
            <button onClick={() => setPromoteUser(null)}>Cancel</button>
          </div>
        </div>
      </Popup>

      {/* Demote Confirmation Popup */}
      <Popup
        open={demoteUser !== null}
        onClose={() => setDemoteUser(null)}
        modal
        closeOnDocumentClick
      >
        <div className="popup-container">
          <h2>Confirm Demotion</h2>
          <p>
            Are you sure you want to demote <strong>{demoteUser?.username}</strong>?
          </p>
          <div className="popup-actions">
            <button onClick={handleDemoteUser}>Demote</button>
            <button onClick={() => setDemoteUser(null)}>Cancel</button>
          </div>
        </div>
      </Popup>

      {/* Remove Popup */}
      <Popup 
        open={deleteUser !== null} 
        onClose={() => setDeleteUser(null)} 
        modal
        closeOnDocumentClick
      >
        <div className="popup-container">
          <h2>Confirm Deletion</h2>
          <p>
            Are you sure you want to remove <strong>{deleteUser?.username}</strong>?
          </p>
          <div className="popup-actions">
            <button onClick={handleRemoveUser}>Remove</button>
            <button onClick={() => setDeleteUser(null)}>Cancel</button>
          </div>
        </div>
      </Popup>

      {/* Add User Popup */}
      <Popup
        open={isAddPopupOpen}
        onClose={() => setIsAddPopupOpen(false)}
        modal
        closeOnDocumentClick
      >
        <div className="popup-container">
          <h2>Add User</h2>
          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>ID:</label>
            <input
              type="text"
              name="bilkentId"
              value={newUser.bilkentId}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>E-mail:</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Phone:</label>
            <input
              type="text"
              name="phoneNo"
              value={newUser.phoneNo}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Status:</label>
            <select
              name="status"
              value={newUser.status}
              onChange={handleChange}
            >
              <option value="GUIDE">Guide</option>
              <option value="ADVISOR">Advisor</option>
              <option value="COORDINATOR">Coordinator</option>
              <option value="ACTING_DIRECTOR">Acting Director</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="popup-actions">
            <button onClick={handleAddUser}>Save</button>
            <button onClick={() => setIsAddPopupOpen(false)}>Cancel</button>
          </div>
        </div>
      </Popup>
    </div>
  );
}