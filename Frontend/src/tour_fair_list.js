import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "./api/axios_config";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./tour_fair_list.css";
import NavbarLayout from "./navbar";
import { FaTimes } from "react-icons/fa"; 

export default function TourListLayout() {
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const { statusUser } = state;
  const navigate = useNavigate();

  const [filteredTours, setFilteredTours] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [claimPopupOpen, setClaimPopupOpen] = useState(false);
  const [selectedClaimTour, setSelectedClaimTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [selectedStatus, setSelectedStatus] = useState();
  const [selectedType, setSelectedType] = useState("HIGHSCHOOL_TOUR");
  const [assignPopupOpen, setAssignPopupOpen] = useState(false);
  const [detailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [selectedAssignTour, setSelectedAssignTour] = useState(null);
  const [selectedDetailsTour, setSelectedDetailsTour] = useState(null);
  const [availableGuides, setAvailableGuides] = useState([]);
  const [detailsGuides, setDetailsGuides] = useState([]);
  const [detailsTrainee, setDetailsTrainee] = useState([]);
  const [detailSuggested, setDetailsSuggested] = useState([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);  
  const [isFirstLoad, setFirstLoad] = useState(null);
  const [guideId, setGuideId] = useState(null);

  // NEW: sort option (only relevant for "Pending" status)
  const [selectedSort, setSelectedSort] = useState("BY_DATE_OF_FORM");

  // Set initial state based on the user role
  useEffect(() => {
    if (statusUser === "GUIDE" && isFirstLoad) {
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
    if (selectedDate === null || selectedDate === undefined) {
      alert("Please select a time.");
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

  const openAssignPopup = async (tour) => {
    setSelectedAssignTour(tour);
    setIsLoadingGuides(true); // Show a loading state
    try {
      const date = new Date(tour.first?.date);
      let dayOfWeek = date.getDay();

      // If it's Sunday, we want it to be 6
      if (dayOfWeek === 0) {
        dayOfWeek = 6;
      } else {
        // Shift other days to make Monday = 0, Tuesday = 1, etc.
        dayOfWeek -= 1;
      }
      console.log("Day of the week:", dayOfWeek);

      // Set the date to the Sunday of the current week
      date.setDate(date.getDate() - dayOfWeek + 1);

      // Format the date as "yyyy-MM-dd"
      const formattedDate = date.toISOString().split('T')[0];

      console.log("Start of the week:", formattedDate);

      const time = tour.first?.time;
      let index;
      if (time === "NINE_AM") {
        index = [7*0+dayOfWeek, 7*1+dayOfWeek, 7*2+dayOfWeek];
      } else if (time === "ELEVEN_AM") {
        index = [7*2+dayOfWeek, 7*3+dayOfWeek, 7*4+dayOfWeek];
      } else if (time === "ONE_THIRTY_PM") {
        index = [7*5+dayOfWeek, 7*6+dayOfWeek, 7*7+dayOfWeek];
      } else if (time === "FOUR_PM") {
        index = [7*7+dayOfWeek, 7*8+dayOfWeek, 7*9+dayOfWeek];
      }  

      console.log(index);
      const response = await api.get("/guidesAvailable", {
        params: {
          date: formattedDate,
          eventId: tour.first?.id,
          index1: index[0],
          index2: index[1],
          index3: index[2],
        }
      });

      if (response.status === 200) {
        console.log(response.data);
        setAvailableGuides(response.data);
      } else {
        alert("Failed to fetch available guides.");
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
      alert("An error occurred while fetching guides.");
    } finally {
      setIsLoadingGuides(false);
      setAssignPopupOpen(true); // Show the popup after fetching guides
    }
  };

  const closeAssignPopup = () => {
    setSelectedAssignTour(null);
    setGuideId("");
    setAssignPopupOpen(false);
  };

  const openDetailsPopup = async (tour) => {
    setSelectedDetailsTour(tour);
    setIsLoadingDetails(true); // Show a loading state
    try {
      const response = await api.get("/event/getGuidesOfEvent", {
        params: { eventId: tour.first?.id }
      });
      console.log(response.data);
      setDetailsGuides(response.data.first);
      setDetailsTrainee(response.data.second);
      setDetailsSuggested(response.data.third);
    } catch (error) {
      console.error("Error fetching guides:", error);
      alert("An error occurred while fetching guides.");
    } finally {
      setIsLoadingDetails(false);
      setDetailsPopupOpen(true); // Show the popup after fetching guides
    }
  };

  const closeDetailsPopup = () => {
    setSelectedDetailsTour(null);
    setDetailsPopupOpen(false);
  };

  const confirmAssignGuide = async (guideId) => {
    try {
      const response = await api.post("/event/offerEvent", {
        formId: selectedAssignTour.second?.id,
        bilkentId: guideId,
      });
      if (response.status === 200) {
        alert("Guide assigned successfully!");
        closeAssignPopup();
      } else {
        alert("Failed to assign the guide.");
      }
    } catch (error) {
      console.error("Error assigning guide:", error);
      alert("An error occurred while assigning the guide.");
    }
  };

  const renderAssignPopupContent = () => {
    if (isLoadingGuides) {
      return <div>Loading available guides...</div>;
    }
  
    if (availableGuides.length === 0) {
      return (
        <div>
          <h3>No Guides Available</h3>
          <p>There are currently no guides available for assignment.</p>
          <button onClick={closeAssignPopup} className="cancel-button">
            Close
          </button>
        </div>
      );
    }
  
    return (
      <div className="assign-popup-content">
        <h3>Assign Guide</h3>
        <p>Select a guide to assign for the tour.</p>
        <table className="guide-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Trainee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {availableGuides.map((guide) => (
              <tr key={guide.id}>
                <td>{guide.username}</td>
                <td>{guide.bilkentId}</td>
                <td>{guide.trainee ? "Yes" : "No"}</td>
                <td>
                  <button
                    onClick={() => confirmAssignGuide(guide.bilkentId)}
                    className="assign-guide-button"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={closeAssignPopup} className="cancel-button">
          Cancel
        </button>
      </div>
    );
  };

  const renderDetailsPopupContent = () => {
    if (!selectedDetailsTour) return null; // Ensure a tour is selected
    console.log(selectedDetailsTour);
    // Format the tour date
    // (Just a placeholder if you want to display it somewhere)
    // e.g. const formattedDate = new Date(selectedDetailsTour.date).toLocaleDateString("en-US");
  
    return (
      <div className="popup-overlay">
        <div className="popup-content">
          {/* Close Icon */}
          <div className="popup-close-icon" onClick={closeDetailsPopup}>
            ×
          </div>
          <h3>Tour Details</h3>
          {selectedDetailsTour.second.type === "HIGHSCHOOL_TOUR" && (
            <p><strong>Counselor Mail: </strong>{selectedDetailsTour.second?.contactMail}</p>
          )}
          {selectedDetailsTour.second.type === "INDIVIDUAL_TOUR" && (
            <p><strong>Contact Mail: </strong>{selectedDetailsTour.second?.contactMail}</p>
          )}
          <h4>Guides</h4>
          <ul>
            {detailsGuides.map((guide, index) => (
              <li key={index}>ID: {guide.bilkentId} Name: {guide.username}</li>
            ))}
          </ul>
          
          <h4>Trainees</h4>
          <ul>
            {detailsTrainee.map((trainee, index) => (
              <li key={index}>ID: {trainee.bilkentId} Name: {trainee.username}</li>
            ))}
          </ul>
          
          <h4>Suggested Guides</h4>
          <ul>
            {detailSuggested.map((suggestion, index) => (
              <li key={index}>ID: {suggestion.bilkentId} Name: {suggestion.username}</li>
            ))}
          </ul>
        </div>
      </div>
    );
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
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State for showing confirmation modal
    const [rejectionReason, setRejectionReason] = useState(""); // State for rejection reason
  
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
      acceptHighSchoolTour(selectedTour, selectedDate); // Pass the selected index
      closePopup();
    };
  
    // Open confirmation modal
    const openConfirmModal = () => {
      if (!rejectionReason.trim()) {
        alert("Please provide a reason for rejection.");
        return;
      }
      setShowConfirmModal(true);
    };
  
    // Close confirmation modal
    const closeConfirmModal = () => {
      setShowConfirmModal(false);
    };
  
    // Handle reject
    const handleReject = async () => {
      try {
        await api.post("/form/eva", {
          formId: selectedTour.id,
          state: "REJECTED",
          index: 0,
          rejectionMessage: rejectionReason.trim(),
        });
        alert("Tour rejected successfully.");
        closePopup();
      } catch (error) {
        console.error("Error rejecting the tour:", error);
        alert("Failed to reject the tour. Please try again.");
      }
    };
  
    // Handle canceling the popup
    const handleCancel = () => {
      closePopup();
    };
  
    return (
      <div className="popup-content">
      <div className="popup-content-evaluate">
        {/* Cross icon for closing */}
        <div className="popup-close-icon" onClick={handleCancel}>
          <FaTimes />
        </div>
  
        <h3>Evaluate Tour</h3>
        {selectedTour.type === "HIGHSCHOOL_TOUR" && (
          <div className="tour-details">
            <p><strong>Tour Name:</strong> {selectedTour.name}</p>
            <p><strong>City:</strong> {selectedTour.city}</p>
            <p><strong>Date:</strong> {formattedDate}</p>
          </div>
        )}
        {/* Additional details for INDIVIDUAL_TOUR */}
        {selectedTour.type === "INDIVIDUAL_TOUR" && (
          <div className="individual-tour-details">
            <h4>Visitor Information</h4>
            <p><strong>Number of Visitors:</strong> {selectedTour.visitorCount}</p>
            <strong>Names:</strong>
            <ul>
              {selectedTour.names.map((visitor, index) => (
                <li key={index}>{visitor}</li>
              ))}
            </ul>
            <p><strong>Department</strong> {selectedTour.department}</p>
            <p><strong>Contact Mail:</strong> {selectedTour.contactMail}</p>
          </div>
        )}
  
        <div className="possible-times">
          <h4>Select Time:</h4>
          {selectedTour.possibleTimes &&
            selectedTour.possibleTimes.map((time, index) => (
              <div key={index} className="time-radio">
                <input
                  className="radio-possible-times"
                  type="radio"
                  id={`time-${index}`}
                  name="time-selection"
                  checked={selectedDate === index}
                  onChange={() => handleTimeChange(index)}
                />
                <label htmlFor={`time-${index}`}>
                  {mapTime(time.second)} - {formatDate(new Date(time.first))}
                </label>
              </div>
            ))}
        </div>
  
        {/* Rejection text area */}
        <div className="rejection-area">
          <h4>Rejection Reason:</h4>
          <textarea
            id="rejection-reason"
            placeholder="Enter the reason for rejection..."
            rows="4"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </div>
  
        <div className="popup-actions">
          <button onClick={handleEvaluateAccept} className="accept-button">
            Accept
          </button>
          <button onClick={openConfirmModal} className="reject-button">
            Reject
          </button>
        </div>
  
        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="confirmation-modal">
            <div className="modal-content">
              <p>Are you sure you want to reject this tour?</p>
              <div className="modal-actions">
                <button onClick={handleReject} className="confirm-button">
                  Yes
                </button>
                <button onClick={closeConfirmModal} className="cancel-button">
                  No
                </button>
              </div>
            </div>
          </div>
        )}
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

  // When "selectedStatus" or "selectedType" changes, fetch data
  useEffect(() => {
    const fetchTours = async () => {
      try {
        let tours;
        setFirstLoad(true);
        console.log(selectedSort);
        if ((selectedStatus === "GUIDE" && isFirstLoad) || selectedStatus === "Accepted") {
          setFirstLoad(false);
          const response = await api.get("/event/getEvents", {
            params: { type: selectedType, state: "ONGOING" },
          });
          tours = response.data;
          setFilteredTours(tours);
        } else if (selectedStatus === "Pending") {
          const response = await api.get("/form/getForms", {
            params: { type: selectedType, state: "NOT_REVIEWED", sort: selectedSort },
          });
          tours = response.data;
          setFilteredTours(tours);
        } else if (selectedStatus === "Rejected") {
          const response = await api.get("/form/getForms", {
            params: { type: selectedType, state: "REJECTED" },
          });
          tours = response.data;
          setFilteredTours(tours);
        }
        console.log(selectedStatus);
        console.log(selectedType);
        console.log(tours);
      } catch (error) {
        console.error("Error fetching filtered tours:", error);
      }
    };
    fetchTours();
  }, [selectedStatus, selectedType, statusUser, selectedSort]);

  

  const renderTable = () => {
    if (!filteredTours || filteredTours.length === 0) {
      return <p>No data available for the selected type.</p>;
    }
  
    const renderActions = (tour) => {
      if (selectedStatus === "Accepted") {
        return (
          <>
            <button className="assign-button" onClick={() => openAssignPopup(tour)}>Assign Guide</button>
            <button className="claim-button" onClick={() => claimTour(tour)}>Claim</button>
            <button className="cancel-button" onClick={() => cancelTour(tour)}>Cancel</button>
            <button className="details-button" onClick={() => openDetailsPopup(tour)}>Details</button>
          </>
        );
      } else if (selectedStatus === "Pending") {
        return (
          <button className="evaluate-button" onClick={() => openPopup(tour)}>Evaluate</button>
        );
      } else {
        return (
          <button className="details-button">Details</button>
        );
      }
    };
  
    // Define column headers and rows dynamically based on selectedType
    const getTableHeaders = () => {
      switch (selectedType) {
        case "HIGHSCHOOL_TOUR":
          if (selectedStatus !== "Accepted") {
            return ["School Name", "City", "Date", "Day", "Time", "Visitor Count","Admissions", "Percentage", "Actions"];
          } else {
            return ["School Name", "City", "Date", "Day", "Time", "Visitor Count", "Actions"];
          }
        case "INDIVIDUAL_TOUR":
          return ["Names", "Department", "Date", "Day", "Time", "Visitor Count", "Actions"];
        case "FAIR":
          if (selectedStatus !== "Accepted") {
            return ["School Name", "City", "Date", "Day","Admissions", "Percentage", "Actions"];
          }else{
            return ["School Name", "City", "Date", "Day",  "Actions"];
          }
        default:
          return [];
      }
    };
  
    const renderRowData = (tour) => {
      switch (selectedType) {
        case "HIGHSCHOOL_TOUR":
          if (selectedStatus !== "Accepted") {
            var firstPossibleTime = tour.form?.possibleTimes?.[0];
            var date = firstPossibleTime ? new Date(firstPossibleTime.first) : null;
            var rawTime = firstPossibleTime?.second || "N/A";
            var formattedTime = mapTime(rawTime);
            var day = date ? date.toLocaleDateString("en-US", { weekday: "long" }) : "N/A";
            var formattedDate = formatDate(date);
            return (
              <>
                <td>{tour.form?.schoolName}</td>
                <td>{tour.form?.city}</td>
                <td>{formattedDate}</td>
                <td>{day}</td>
                <td>{formattedTime}</td>
                <td>{tour.form?.visitorCount}</td>
                <td>{tour.bilkentAdmissions}</td>
                <td>{tour.bilkentAdmissionsPercentage}</td>
                <td>{renderActions(tour)}</td>
              </>
            );
          } else {
            // Accepted tours come with different data structure
            var firstAcceptedTime = tour.first?.date;
            var dateAccepted = firstAcceptedTime ? new Date(firstAcceptedTime) : null;
            var rawTimeAccepted = tour.first?.time || "N/A";
            var formattedTimeAccepted = mapTime(rawTimeAccepted);
            var dayAccepted = dateAccepted ? dateAccepted.toLocaleDateString("en-US", { weekday: "long" }) : "N/A";
            var formattedDateAccepted = formatDate(dateAccepted);
            return (
              <>
                <td>{tour.second?.schoolName}</td>
                <td>{tour.second?.city}</td>
                <td>{formattedDateAccepted}</td>
                <td>{dayAccepted}</td>
                <td>{formattedTimeAccepted}</td>
                <td>{tour.second?.visitorCount}</td>
                <td>{renderActions(tour)}</td>
              </>
            );
          }
        case "INDIVIDUAL_TOUR":
          if (selectedStatus !== "Accepted") {
            var firstPossibleTime = tour.possibleTimes?.[0];
            var date = firstPossibleTime ? new Date(firstPossibleTime.first) : null;
            var rawTime = firstPossibleTime?.second || "N/A";
            var formattedTime = mapTime(rawTime);
            var day = date ? date.toLocaleDateString("en-US", { weekday: "long" }) : "N/A";
            var formattedDate = formatDate(date);
            return (
              <>
                <td>{tour.names}</td>
                <td>{tour.department}</td>
                <td>{formattedDate}</td>
                <td>{day}</td>
                <td>{formattedTime}</td>
                <td>{tour.visitorCount}</td>
                <td>{renderActions(tour)}</td>
              </>
            );
          } else {
            var firstAcceptedTime = tour.first?.date;
            var dateAccepted = firstAcceptedTime ? new Date(firstAcceptedTime) : null;
            var rawTimeAccepted = tour.first?.time || "N/A";
            var formattedTimeAccepted = mapTime(rawTimeAccepted);
            var dayAccepted = dateAccepted ? dateAccepted.toLocaleDateString("en-US", { weekday: "long" }) : "N/A";
            var formattedDateAccepted = formatDate(dateAccepted);
            return (
              <>
                <td>{tour.second?.names}</td>
                <td>{tour.second?.department}</td>
                <td>{formattedDateAccepted}</td>
                <td>{dayAccepted}</td>
                <td>{formattedTimeAccepted}</td>
                <td>{tour.second?.visitorCount}</td>
                <td>{renderActions(tour)}</td>
              </>
            );
          }
        case "FAIR":
          if (selectedStatus !== "Accepted") {
            var firstPossibleTime = tour.form?.possibleTimes?.[0];
            var date = firstPossibleTime ? new Date(firstPossibleTime.first) : null;
            var rawTime = firstPossibleTime?.second || "N/A";
            var formattedTime = mapTime(rawTime);
            var day = date ? date.toLocaleDateString("en-US", { weekday: "long" }) : "N/A";
            var formattedDate = formatDate(date);
            return (
              <>
                <td>{tour.form?.schoolName}</td>
                <td>{tour.form?.city}</td>
                <td>{formattedDate}</td>
                <td>{day}</td>
                <td>{tour.bilkentAdmissions}</td>
                <td>{tour.bilkentAdmissionsPercentage}</td>
                <td>{renderActions(tour)}</td>
              </>
            );
          } else {
            var firstAcceptedTime = tour.first?.date;
            var dateAccepted = firstAcceptedTime ? new Date(firstAcceptedTime) : null;
            var rawTimeAccepted = tour.first?.time || "N/A";
            var formattedTimeAccepted = mapTime(rawTimeAccepted);
            var dayAccepted = dateAccepted ? dateAccepted.toLocaleDateString("en-US", { weekday: "long" }) : "N/A";
            var formattedDateAccepted = formatDate(dateAccepted);
            return (
              <>
                <td>{tour.second?.schoolName}</td>
                <td>{tour.second?.city}</td>
                <td>{formattedDateAccepted}</td>
                <td>{dayAccepted}</td>
                <td>{renderActions(tour)}</td>
              </>
            );
          }
        default:
          return null;
      }
    };
  
    const headers = getTableHeaders();
  
    return (
      <table className="tour-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredTours.map((tour) => (
            <tr key={tour.first?.id}>{renderRowData(tour)}</tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="home-layout">
      <NavbarLayout />
      <div className="main-content-tour-fair-list">
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

          {/* NEW: Only show sort dropdown when status is "Pending" */}
          {selectedStatus === "Pending" && selectedType != "INDIVIDUAL_TOUR" &&(
            <>
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value="BY_DATE_OF_FORM">Date</option>
                <option value="BY_ADMISSIONS_TO_BILKENT">Admissions to Bilkent</option>
                <option value="BY_PERCENTAGE_OF_ADMISSIONS_TO_BILKENT">Percentage of Admissions</option>
              </select>
            </>
          )}
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

      <Popup open={assignPopupOpen} onClose={closeAssignPopup} modal>
        {renderAssignPopupContent()}
      </Popup>

      <Popup open={detailsPopupOpen} onClose={closeDetailsPopup} modal>
        {renderDetailsPopupContent()}
      </Popup>
    </div>
  );
}