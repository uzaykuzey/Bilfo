import React, { useState, useEffect } from "react";
import "./availability.css";
import { useParams } from "react-router-dom";
import NavbarLayout from "./navbar";
import api from "./api/axios_config";

export default function AvailabilityLayout() {
  const { bilkentId } = useParams();
  const rows = [
    "8.20 – 9.20",
    "9.20 – 10.20",
    "10.20 – 11.20",
    "11.20 – 12.20",
    "12.20 – 13.20",
    "13.20 – 14.20",
    "14.20 – 15.20",
    "15.20 – 16.20",
    "16.20 – 17.20",
    "17.20 – 18.20",
    "18.20 – 19.20",
  ];

  const columns = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // State to store the color of each cell (red or white)
  const [tableData, setTableData] = useState({});

  // Fetch availability string on page load
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        // Make GET request to fetch the availability string
        const response = await api.get("/getAvailability", { params: { bilkentId: bilkentId } });
        const availabilityString = response.data;  
        console.log(availabilityString)// assuming the response contains the availabilityString

        // Initialize tableData with red (1) or white (0) based on the fetched string
        const newTableData = {};
        for (let i = 0; i < availabilityString.length; i++) {
          const rowIndex = Math.floor(i / columns.length); // Determine row based on position in the string
          const colIndex = i % columns.length; // Determine column based on position in the string
          newTableData[`${rowIndex}-${colIndex}`] = availabilityString[i] === '1' ? 'red' : 'white';
        }
        setTableData(newTableData);  // Update state with the new tableData
      } catch (error) {
        console.error("Error fetching availability data:", error);
      }
    };

    fetchAvailability();
  }, [bilkentId]); // Trigger the effect when the bilkentId changes

  const handleCellClick = (rowIndex, colIndex) => {
    const key = `${rowIndex}-${colIndex}`;
    const newColor = tableData[key] === "red" ? "white" : "red";
    setTableData({ ...tableData, [key]: newColor });
  };

  const handleSave = async () => {
    // Create a string of 77 characters where each character represents a cell (1 for red, 0 for white)
    let saveString = "";

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const key = `${rowIndex}-${colIndex}`;
        const value = tableData[key] === "red" ? "1" : "0";  // Treat red as 1 and white as 0
        saveString += value;
      }
    }

    // Ensure the string has exactly 77 characters
    if (saveString.length !== 77) {
      alert("The string generated is not 77 characters long.");
      return;
    }

    // Send the string to the backend using Axios
    try {
      const response = await api.post("/changeAvailability", {
        bilkentId: bilkentId,
        availabilityString: saveString,
      });
      console.log("Data saved:", response.data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="home-layout">
      <NavbarLayout />

      <div className="main-content-availability">
        <h2>Availability Schedule</h2>

        <table className="availability-table">
          <thead>
            <tr>
              <th>Time</th>
              {columns.map((day, index) => (
                <th key={index}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((time, rowIndex) => (
              <tr key={rowIndex}>
                <td>{time}</td>
                {columns.map((_, colIndex) => {
                  const key = `${rowIndex}-${colIndex}`;
                  return (
                    <td
                      key={colIndex}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`clickable-cell ${tableData[key] || "white"}`}
                    >
                      {/* Content of the cell (optional) */}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
