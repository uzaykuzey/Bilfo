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
  const [isAddLogPopupOpen, setIsAddLogPopupOpen] = useState(false); // Control popup visibility
  const [currentMonth, setCurrentMonth] = useState(dayjs()); // Initialize with current date
  const [logToDelete, setLogToDelete] = useState(null); // To store the log that will be deleted
  const [addLogs, setAddLogs] = useState(null); // To store logs that can be added
  const [hours, setHours] = useState(""); // Store hours entered by the user
  const [selectedAddLog, setSelectedAddLog] = useState(null); // Store selected log to add
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
        const addLogResponse = await api.get("/log/getEventsOfUserThatDontHaveLogsAndFinished", {params : {bilkentId : bilkentId}});
        console.log(response.data);
        console.log(addLogResponse.data);
        if (response.status === 200) {
          setLogs(response.data);
          setAddLogs(addLogResponse.data);
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
    setIsAddLogPopupOpen(true); // Open the popup when the button is clicked
    setSelectedAddLog(null); // Clear any previously selected log
    setHours(""); // Clear the hours input
  };
  

  const handleAddLogSubmit = async () => {
    if (!selectedAddLog || !hours) {
      setError("Please select a log and enter hours.");
      return;
    }

    try {
      const requestData = {
        eventId: selectedAddLog.first?.id,
        bilkentId: bilkentId,
        hours: hours,
      };

      const response = await api.post("/log/addLog", requestData); // Replace with your add log API endpoint
      if (response.status === 200) {
        // Successfully added log
        setAddLogs((prevAddLogs) => prevAddLogs.filter((log) => log.id !== selectedAddLog.id)); // Remove the added log from the available logs
        setHours(""); // Reset the input field
      } else {
        setError("Failed to add log. Please try again later.");
      }
    } catch (err) {
      console.error("Error adding log:", err);
      setError("Failed to add log. Please try again.");
    }
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

  // Add a function to format the tour type
  const formatTourType = (type) => {
    switch(type) {
        case 'HIGHSCHOOL_TOUR':
            return 'High School Tour';
        case 'INDIVIDUAL_TOUR':
            return 'Individual Tour';
        default:
            return type;
    }
  };

  return (
    <div className="home-layout">
      <NavbarLayout />
      <div className="main-content-puantaj">
        <h1>My Logs</h1>
        
        <div className="header-controls">
            <div className="month-navigation">
                <button onClick={handlePreviousMonth} className="month-btn">◀</button>
                <span className="current-month">{currentMonth.format("MMMM YYYY")}</span>
                <button onClick={handleNextMonth} className="month-btn">▶</button>
            </div>
        </div>

        <button className="add-log-btn" onClick={handleAddLog}>
            Add Log
        </button>

        {error && <p className="error-message">{error}</p>}
        
        <div className="log-table-container-normal">
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
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={index}>
                                <td>{log.third?.schoolName}</td>
                                <td>{formatTourType(log.third?.type)}</td>
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
        </div>
      </div>

      {/* Confirmation Modal for Deletion */}
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

      <Popup
        open={isAddLogPopupOpen} // Show modal when `isAddLogPopupOpen` is true
        onClose={() => setIsAddLogPopupOpen(false)} // Close the popup when the user cancels or closes
        modal
        nested
        contentStyle={{
          maxWidth: '1200px', 
          width: '90%', 
          padding: '20px', 
          margin: '0 auto', 
        }}
      >
        <div className="add-log-modal">
          <h2>Select a Log to Add</h2>
          
          {/* Conditional rendering for available logs */}
          {addLogs && addLogs.length > 0 ? (
            <>
              <table className="add-log-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {addLogs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedAddLog(log)} // Select log to add
                      style={{ cursor: "pointer" }}
                    >
                      <td>{log.second?.schoolName}</td>
                      <td>{log.second?.type}</td>
                      <td>{log.first?.date 
                      ? new Date(log.first?.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                      : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedAddLog && (
                <>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)} // Set the hours input
                    placeholder="Enter hours"
                  />
                  <button onClick={handleAddLogSubmit}>Add Log</button>
                </>
              )}
            </>
          ) : (
            <p>No event available to add.</p> // Show message when no logs are available
          )}

          <button onClick={() => setIsAddLogPopupOpen(false)}>Cancel</button>
        </div>
      </Popup>

    </div>
  );
}
