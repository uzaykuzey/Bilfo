import NavbarLayout from "./navbar";
import "./puantaj_table.css";
import React, { useState, useEffect } from "react";
import api from "./api/axios_config"; 
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";// Make sure you have a proper axios instance set up

export default function PuantajLayout() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // For handling loading state
  const [error, setError] = useState(""); 
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const { statusUser } = state;
  const navigate = useNavigate();

  // Fetch logs on page load
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get("/getLogs"); // Replace with your actual API endpoint
        if (response.status === 200) {
          setLogs(response.data);
        } else {
          setLogs([]); // If no data returned
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError("Failed to load logs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleDelete = async (index) => {
    try {
      const logToDelete = logs[index];
      const response = await api.post("/deleteLog", { id: logToDelete.id }); // Replace with your delete API
      if (response.status === 200) {
        setLogs((prevLogs) => prevLogs.filter((_, i) => i !== index));
      }
    } catch (err) {
      console.error("Error deleting log:", err);
      setError("Failed to delete log. Please try again.");
    }
  };

  const handleAddLog = () => {
    // Add log functionality
    console.log("Add log clicked!");
  };

  return (
    <div className="home-layout">
      <NavbarLayout />
      <div className="content">
        <h1>My Logs</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="log-table-container">
          {isLoading ? (
            <p>Loading logs...</p>
          ) : logs.length > 0 ? (
            <table className="log-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Hour</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.name}</td>
                    <td>{log.type}</td>
                    <td>{log.date}</td>
                    <td>{log.hour}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data-message">No logs found.</p>
          )}
          <button className="add-log-btn" onClick={handleAddLog}>
            Add Log
          </button>
        </div>
      </div>
    </div>
  );
}
