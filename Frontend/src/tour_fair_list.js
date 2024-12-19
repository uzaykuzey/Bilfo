import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "./api/axios_config";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./tour_fair_list.css";
import NavbarLayout from "./navbar";

export default function TourListLayout() {
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const { statusUser } = state;
  const navigate = useNavigate();

  const [filteredTours, setFilteredTours] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedDate, setSelectedDate] = useState([]);
  const [claimPopupOpen, setClaimPopupOpen] = useState(false);
  const [selectedClaimTour, setSelectedClaimTour] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [selectedType, setSelectedType] = useState("HIGHSCHOOL_TOUR");

  // Set initial state based on the user role
  useEffect(() => {
    if (statusUser === "GUIDE") {
      setSelectedStatus("Accepted");
    } else {
      setSelectedStatus("Pending");
    }
  }, [statusUser]);

  const handleDateChange = (e, index) => {
    setSelectedDate(index);
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
        return "N/A";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };


  const openPopup = (tour) => {
    setSelectedTour(tour);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedTour(null);
    setPopupOpen(false);
  };

  const claimTour = (tour) => {
    setSelectedClaimTour(tour);
    setClaimPopupOpen(true);
  };

  const confirmClaim = async (tour) => {
    try {
      const response = await api.post("/event/claimEvent", { bilkentId: bilkentId, formId: selectedClaimTour.second.id });
      if (response.status === 200) {
        alert("Tour claimed successfully!");
        setClaimPopupOpen(false);
      } else {
        alert("Failed to claim the tour.");
      }
    } catch (error) {
      console.error("Error claiming tour:", error);
      alert("An error occurred while claiming the tour.");
    }
  };

  const acceptHighSchoolTour = async (tour, selectedIndex) => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
    try {
      var index = parseInt(selectedIndex);
      const payload = {
        formId: tour.id,
        state: "ACCEPTED",
        index: index,
        rejectionMessage: "", // Empty as this is an acceptance
      };
      const response = await api.post("/form/eva", payload);
      if (response.status === 200) {
        alert("Tour accepted successfully!");
      } else {
        alert("Failed to accept the tour.");
      }
    } catch (error) {
      alert("An error occurred while accepting the tour.");
    }
  };

  const assignGuide = async (tour) => {
    // Assign a guide to the tour
    try {
      const response = await api.post("/form/assignGuide", { formId: tour.id, bilkentId });
      if (response.status === 200) {
        alert("Guide assigned successfully!");
      } else {
        alert("Failed to assign guide.");
      }
    } catch (error) {
      alert("An error occurred while assigning the guide.");
    }
  };

  const cancelTour = async (tour) => {
    // Cancel the tour
    try {
      const response = await api.post("/form/cancelTour", { formId: tour.id });
      if (response.status === 200) {
        alert("Tour canceled successfully!");
      } else {
        alert("Failed to cancel the tour.");
      }
    } catch (error) {
      alert("An error occurred while canceling the tour.");
    }
  };

  const renderPopupContent = () => {
    if (!selectedTour) return null;
  
    // Format the tour date
    const date = new Date(selectedTour.date);
    const formattedDate = formatDate(date);
  
    // Handle the time selection (radio buttons)
    const handleTimeChange = (timeIndex) => {
      setSelectedDate(timeIndex); // Store only one selected index
    };
  
    // Handle evaluation accept
    const handleEvaluateAccept = () => {
      if (selectedDate === null || selectedDate === undefined) {
        alert("Please select a time.");
        return;
      }
  
      // Send the evaluation data (update with real API call)
      acceptHighSchoolTour(selectedTour, selectedDate); // Pass the selected index
      closePopup();
    };
  
    // Handle canceling the popup
    const handleCancel = () => {
      closePopup();
    };
  
    return (
      <div className="popup-content">
        <h3>Evaluate Tour</h3>
        <p><strong>Tour Name:</strong> {selectedTour.name}</p>
        <p><strong>Location:</strong> {selectedTour.location}</p>
        <p><strong>Date:</strong> {formattedDate}</p>
  
        <div className="possible-times">
          <h4>Select Time:</h4>
          {selectedTour.possibleTimes && selectedTour.possibleTimes.map((time, index) => (
            <div key={index} className="time-radio">
              <input
                type="radio"
                id={`time-${index}`}
                name="time-selection" // Ensures only one can be selected
                checked={selectedDate === index}
                onChange={() => handleTimeChange(index)}
              />
              <label htmlFor={`time-${index}`}>
                {mapTime(time.second)} - {formatDate(new Date(time.first))}
              </label>
            </div>
          ))}
        </div>
  
        <div className="popup-actions">
          <button onClick={handleEvaluateAccept} className="accept-button">Accept</button>
          <button onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
      </div>
    );
  };
  
  

  const renderClaimPopupContent = () => {
    return (
      <div className="claim-popup-content">
        <h3>Claim Tour</h3>
        <p>Are you sure you want to claim this tour?</p>
        <button onClick={() => confirmClaim(selectedClaimTour)}>Confirm Claim</button>
        <button onClick={() => setClaimPopupOpen(false)}>Cancel</button>
      </div>
    );
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        let tours;
        if(selectedStatus == "Pending"){
          const response = await api.get("/form/getForms", { params: { type: selectedType, state: "NOT_REVIEWED" } });
          tours = response.data;
          setFilteredTours(tours);
        }else if(selectedStatus == "Accepted"){
          const response = await api.get("/event/getEvents", { params: { type: selectedType, state: "ONGOING" } });
          tours = response.data;
          setFilteredTours(tours);
        }else{
          const response = await api.get("/event/getEvents", { params: { type: selectedType, state: "CANCELLED" } });
          tours = response.data;
          setFilteredTours(tours);
        }
        console.log(selectedStatus);
        console.log(selectedType);
        console.log(tours);
        setFilteredTours(tours);
      } catch (error) {
        console.error("Error fetching filtered tours:", error);
      }
    };

    fetchTours();
  }, [selectedStatus, selectedType, statusUser]);

  const renderTable = () => {
    if (!filteredTours || filteredTours == []) {
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

    return (
      <table className="tour-table">
        <thead>
          <tr>
            <th>{selectedType === "Fairs" ? "Fair Name" : "School Name"}</th>
            <th>{selectedType === "Fairs" ? "Location" : "City"}</th>
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
            const day = date ? date.toLocaleDateString("en-US", { weekday: "long" }) : "N/A";
            const formattedDate = formatDate(date);

            return (
              <tr key={tour.id}>
                <td>{tour.schoolName || tour.fairName}</td>
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
  };

  return (
    <div className="home-layout">
      <NavbarLayout />
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
            <option value="HIGHSCHOOL_TOUR">High School Tours</option>
            <option value="INDIVIDUAL_TOUR">Individual Tours</option>
            <option value="FAIR">Fairs</option>
          </select>
        </div>
        <div className="tour-list">
          {renderTable()}
        </div>
      </div>

      <Popup open={popupOpen} onClose={closePopup} modal>
        {renderPopupContent()}
      </Popup>

      <Popup open={claimPopupOpen} onClose={() => setClaimPopupOpen(false)} modal>
        {renderClaimPopupContent()}
      </Popup>
    </div>
  );
}
