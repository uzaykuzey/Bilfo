import NavbarLayout from "./navbar";
import "./puantaj_table.css";
import React, { useState, useEffect } from "react";
import api from "./api/axios_config";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import Popup from "reactjs-popup"; // Import reactjs-popup

export default function PuantajLayout() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // For handling loading state
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(dayjs()); // Initialize with current date
  const [logToDelete, setLogToDelete] = useState(null); // To store the log that will be deleted
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const { statusUser } = state;
  const navigate = useNavigate();

  // Fetch logs for the selected month
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/log/getLogs", {
          params: {
            bilkentId: bilkentId,
            monthDate: currentMonth.format("YYYY-MM") + "-01", // Send the selected month to the API
          },
        });
        console.log(response.data);
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
  }, [currentMonth]); // Re-fetch logs whenever currentMonth changes

  const handleDelete = async () => {
    try {
      const requestData = {
        logId: logToDelete.first?.id,         // The ID of the log you want to delete
        bilkentId: bilkentId,       // The Bilkent ID of the user
      };

      // Make the API call to delete the log
      const response = await api.post("/log/deleteLog", requestData); // Replace with your delete API endpoint
      if (response.status === 200) {
        // Remove the deleted log from the local state
        setLogs((prevLogs) => prevLogs.filter((log) => log.first?.id !== logToDelete.first?.id));
      } else {
        setError("Failed to delete log. Please try again later.");
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

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => prev.add(1, "month"));
  };

  const confirmDelete = (log) => {
    setLogToDelete(log);  // Set the log to be deleted
  };

  return (
    <div className="home-layout">
      <NavbarLayout />
      <div className="content">
        <h1>My Logs</h1>
        <div className="month-navigation">
          <button onClick={handlePreviousMonth} className="month-btn">◀ Previous</button>
          <span className="current-month">{currentMonth.format("MMMM YYYY")}</span>
          <button onClick={handleNextMonth} className="month-btn">Next ▶</button>
        </div>
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
                    <td>{log.third?.schoolName}</td>
                    <td>{log.third?.type}</td>
                    <td>{log.second?.date 
                      ? new Date(log.second.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                      : ""}</td>
                    <td>{log.first?.hours}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => confirmDelete(log)} // Show confirmation modal
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

      {/* Confirmation Modal using react-popup */}
      <Popup
        open={logToDelete !== null} // Check if a log is selected for deletion
        onClose={() => setLogToDelete(null)} // Close modal when canceled
        modal
        nested
      >
        <div className="delete-modal">
          <h2>Are you sure you want to delete this log?</h2>
          <div className="delete-modal-actions">
            <button onClick={handleDelete}>Confirm</button>
            <button onClick={() => setLogToDelete(null)}>Cancel</button>
          </div>
        </div>
      </Popup>
    </div>
  );
}
