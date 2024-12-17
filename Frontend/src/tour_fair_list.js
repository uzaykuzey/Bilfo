import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "./api/axios_config";
import Popup from "reactjs-popup";  // Make sure to import the popup component
import "reactjs-popup/dist/index.css";  // Import styles for the popup
import "./tour_fair_list.css";
import NavbarLayout from "./navbar";

export default function TourListLayout() {
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const { statusUser } = state;
  const navigate = useNavigate();

  const [pendingTours, setPendingTours] = useState([]);
  const [acceptedTours, setAcceptedTours] = useState([]);
  const [rejectedTours, setRejectedTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [selectedType, setSelectedType] = useState("All");
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const goToGuideList = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/guide_list`, { state: { statusUser } });
  };
  const handleDateChange = (e, index) => {
    
    setSelectedDate(index); // Store the whole selected time object
  };
  

  const mapTime = (time) => {
    switch (time) {
      case "NINE_AM":
        return "9.00";
      case "ELEVEN_AM":
        return "11.00";
      case "ONE_THIRTY_PM":
        return "13.30";
      case "FOUR_PM":
        return "16.00";
      default:
        return "N/A"; // Default fallback if time doesn't match
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatNames = (names) => {
    if (!Array.isArray(names) || names.length === 0) {
      return "N/A"; // Return a fallback value if names is undefined or empty
    }
    if (names.length <= 3) {
      return names.join(", ");
    }
    return `${names.slice(0, 3).join(", ")}...`;
  };

  const openPopup = (tour) => {
    setSelectedTour(tour);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedTour(null);
    setPopupOpen(false);
  };

  const assignGuide = (tour) => {
    console.log("Assign Guide clicked for:", tour);
    // Implement the functionality here
  };
  
  const claimTour = (tour) => {
    console.log("Claim clicked for:", tour);
    // Implement the functionality here
  };
  
  const cancelTour = (tour) => {
    console.log("Cancel clicked for:", tour);
    // Implement the functionality here
  };
  
  const acceptHighSchoolTour = async (tour,selectedIndex) => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
    console.log(tour);
    try {
      var index = parseInt(selectedIndex);
      const payload = {
        formId: tour.id,
        state: "ACCEPTED", 
        index: index,  // Pass the selected date here
        rejectionMessage: "", // Empty as this is an acceptance
      };
  
      console.log(payload);
      const response = await api.post("/form/eva", payload);
  
      if (response.status === 200) {
        alert("Tour accepted successfully!");
      } else {
        alert("Failed to accept the tour.");
      }
    } catch (error) {
      console.error("Error accepting tour:", error);
      alert("An error occurred while accepting the tour.");
    }
  };
  
  useEffect(() => {
    const fetchToursFairs = async () => {
      try {
        const responseForm = await api.get("/form");
        const responseEvent = await api.get("/event");
        console.log(responseForm);
        console.log(responseEvent);
        const pending = responseForm.data.filter(
          (item) => item.approved === "NOT_REVIEWED"
        );
        const accepted = responseForm.data.filter(
          (item) => item.approved === "ACCEPTED"
        );
        const rejected = responseForm.data.filter(
          (item) => item.approved === "REJECTED"
        );
        console.log(accepted);
        setPendingTours(pending);
        setAcceptedTours(accepted);
        setRejectedTours(rejected);

        if (statusUser === "GUIDE") {
          setSelectedStatus("Accepted");
          setSelectedType("High School Tours");
          setFilteredTours(
            accepted.filter((tour) => tour.type === "HIGHSCHOOL_TOUR")
          );
        } else {
          setSelectedStatus("Pending");
          setSelectedType("High School Tours");
          setFilteredTours(
            pending.filter((tour) => tour.type === "HIGHSCHOOL_TOUR")
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchToursFairs();
  }, [statusUser]);

  useEffect(() => {
    let tours = [];
    if (selectedStatus === "Pending") tours = pendingTours;
    else if (selectedStatus === "Accepted") tours = acceptedTours;
    else if (selectedStatus === "Rejected") tours = rejectedTours;

    if (selectedType === "High School Tours") 
      tours = tours.filter((tour) => tour.type === "HIGHSCHOOL_TOUR");
    else if (selectedType === "Individual Tours")
      tours = tours.filter((tour) => tour.type === "INDIVIDUAL_TOUR");
    else if (selectedType === "Fairs")
      tours = tours.filter((tour) => tour.type === "FAIR");

    setFilteredTours(tours);
  }, [selectedStatus, selectedType, pendingTours, acceptedTours, rejectedTours]);

  const renderTable = () => {
    if (filteredTours.length === 0) {
      return <p>No data available for the selected type.</p>;
    }
  
    const renderActions = (tour) => {
      if (selectedStatus === "Accepted") {
        return (
          <>
            <button className="assign-button" onClick={() => assignGuide(tour)}>Assign Guide</button>
            <button className="claim-button" onClick={() => claimTour(tour)}>Claim</button>
            <button className="cancel-button" onClick={() => cancelTour(tour)}>Cancel</button>
            <button className="details-button" onClick={() => openPopup(tour)}>Details</button>
          </>
        );
      } else {
        return (
          <button className="evaluate-button" onClick={() => openPopup(tour)}>Evaluate</button>
        );
      }
    };
  
    if (selectedType === "High School Tours") {
      return (
        <table className="tour-table">
          <thead>
            <tr>
              <th>School Name</th>
              <th>City</th>
              <th>Date</th>
              <th>Day</th>
              <th>Time</th>
              <th>Participant Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTours.map((tour) => {
              const firstPossibleTime = tour.possibleTimes?.[0];
              const date = firstPossibleTime ? new Date(firstPossibleTime.first) : null;
              const rawTime = firstPossibleTime?.second || "N/A";
              const formattedTime = mapTime(rawTime);
              const day = date
                ? date.toLocaleDateString("en-US", { weekday: "long" })
                : "N/A";
              const formattedDate = formatDate(date);
  
              return (
                <tr key={tour.id}>
                  <td>{tour.schoolName}</td>
                  <td>{tour.location}</td>
                  <td>{formattedDate}</td>
                  <td>{day}</td>
                  <td>{formattedTime}</td>
                  <td>{tour.visitorCount}</td>
                  <td>{renderActions(tour)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
  
    if (selectedType === "Individual Tours") {
      return (
        <table className="tour-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Date</th>
              <th>Day</th>
              <th>Time</th>
              <th>Visitor Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTours.map((tour) => {
              const firstPossibleTime = tour.possibleTimes?.[0];
              const date = firstPossibleTime ? new Date(firstPossibleTime.first) : null;
              const rawTime = firstPossibleTime?.second || "N/A";
              const formattedTime = mapTime(rawTime);
              const day = date
                ? date.toLocaleDateString("en-US", { weekday: "long" })
                : "N/A";
              const formattedDate = formatDate(date);
  
              return (
                <tr key={tour.id}>
                  <td>{formatNames(tour.names)}</td>
                  <td>{tour.department}</td>
                  <td>{formattedDate}</td>
                  <td>{day}</td>
                  <td>{formattedTime}</td>
                  <td>{tour.visitorCount}</td>
                  <td>{renderActions(tour)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }else if (selectedType === "Fairs") {
      return (
        <table className="tour-table">
          <thead>
            <tr>
              <th>School Name</th>
              <th>Location</th>
              <th>Date</th>
              <th>Day</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTours.map((fair) => {
              const firstPossibleTime = fair.possibleTimes?.[0];
              const date = firstPossibleTime ? new Date(firstPossibleTime.first) : null;
              const rawTime = firstPossibleTime?.second || "N/A";
              const formattedTime = mapTime(rawTime);
              const day = date
                ? date.toLocaleDateString("en-US", { weekday: "long" })
                : "N/A";
              const formattedDate = formatDate(date);
  
              return (
                <tr key={fair.id}>
                  <td>{fair.schoolName}</td>
                  <td>{fair.location}</td>
                  <td>{formattedDate}</td>
                  <td>{formattedTime}</td>
                  <td>{day}</td>
                  <td>
                    <button className="evaluate-button" onClick={() => openPopup(fair)}>Evaluate</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
  };
  

  const renderPopupContent = () => {
    if (!selectedTour) return null;
  
    const popupStyles = {
      container: {
        width: "90%",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
      },
      heading: {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "10px",
        color: "#333",
        borderBottom: "2px solid #ddd",
        paddingBottom: "5px",
      },
      paragraph: {
        fontSize: "16px",
        margin: "10px 0",
        color: "#555",
      },
      section: {
        marginBottom: "15px",
      },
    };
  
    const renderDetails = (title, details) => (
      <div style={popupStyles.section}>
        <h3 style={popupStyles.heading}>{title}</h3>
        {details.map((detail, index) => (
          <p key={index} style={popupStyles.paragraph}>
            {detail}
          </p>
        ))}
      </div>
    );
  
    if (selectedTour.type === "HIGHSCHOOL_TOUR") {
  return (
    <div style={popupStyles.container}>
      {renderDetails("High School Tour Details", [
        `School Name: ${selectedTour.schoolName}`,
        `City: ${selectedTour.location}`,
        `Visitor Count: ${selectedTour.visitorCount}`,
      ])}
      {selectedTour.possibleTimes.map((time, index) => (
        <div key={index}>
          <label>
            <input 
              type="radio" 
              name="selectedDate" 
              value={time.first} 
              onChange={(e) => handleDateChange(e, index)} // Pass index directly
            />
            {time.first}
          </label>
        </div>
      ))}
      <button onClick={() => acceptHighSchoolTour(selectedTour, selectedDate)}>Accept</button>
      <button>Reject</button>
    </div>
  );
}
  
    if (selectedTour.type === "INDIVIDUAL_TOUR") {
      return (
        <div style={popupStyles.container}>
          {renderDetails("Individual Tour Details", [
            `Visitor Names: ${selectedTour.names.join(", ")}`,
            `Department: ${selectedTour.department}`,
            `Visitor Count: ${selectedTour.visitorCount}`,
          ])}
          {selectedTour.possibleTimes.map((time, index) => (
              <div key={index}>
                <label>
                  <input 
                    type="radio" 
                    name="selectedDate" 
                    value={time.first} 
                  />
                  {time.first}
                </label>
              </div>
            ))}
          <button>Accept</button>
          <button>Reject</button>
        </div>
      );
    }
  
    if (selectedTour.type === "FAIR") {
      return (
        <div style={popupStyles.container}>
          {renderDetails("Fair Details", [
            `Fair Name: ${selectedTour.schoolName}`,
            `Location: ${selectedTour.location}`,
          ])}
        </div>
      );
    }
  };
  

  return (
    <div className="home-layout">
      {<NavbarLayout/>}

      <div className="main-content">
        <h2>Tours and Fairs</h2>

        <div className="filters">
          <label htmlFor="status">Status: </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>

          <label htmlFor="type">Type: </label>
          <select
            id="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="High School Tours">High School Tours</option>
            <option value="Individual Tours">Individual Tours</option>
            <option value="Fairs">Fairs</option>
          </select>
        </div>

        <div className="tour-list">
          {renderTable()}
        </div>
      </div>

      <Popup open={popupOpen} onClose={closePopup} modal>
        {renderPopupContent()}
      </Popup>
    </div>
  );
}
