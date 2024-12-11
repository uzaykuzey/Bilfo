import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "./api/axios_config";
import "./tour_fair_list.css";

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

  const goToGuideList = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/guide_list`, { state: { statusUser } });
  };

  const goToTourFairList = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/tour_fair_list`, { state: { statusUser } });
  };

  useEffect(() => {
    const fetchToursFairs = async () => {
      try {
        const responseForm = await api.get("/form");
        const responseEvent = await api.get("/event");

        const pending = responseForm.data.filter(
          (item) => item.approved === "NOT_REVIEWED"
        );
        const accepted = responseEvent.data.filter(
          (item) => item.approved === "ACCEPTED"
        );
        const rejected = responseEvent.data.filter(
          (item) => item.approved === "REJECTED"
        );

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
    console.log(tours);
    setFilteredTours(tours);
  }, [selectedStatus, selectedType, pendingTours, acceptedTours, rejectedTours]);

  const renderTable = () => {
    if (filteredTours.length === 0) {
      return <p>No data available for the selected type.</p>;
    }

    if (selectedType === "High School Tours") {
      return (
        <table className="tour-table">
          <thead>
            <tr>
              <th>Tour Name</th>
              <th>Location</th>
              <th>Date</th>
              <th>School Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTours.map((tour) => (
              <tr key={tour.id}>
                <td>{tour.name}</td>
                <td>{tour.location}</td>
                <td>{tour.date}</td>
                <td>{tour.schoolName}</td>
                <td>
                  <button className="evaluate-button">Evaluate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (selectedType === "Individual Tours") {
      return (
        <table className="tour-table">
          <thead>
            <tr>
              <th>Tour Name</th>
              <th>Location</th>
              <th>Date</th>
              <th>Participant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTours.map((tour) => (
              <tr key={tour.id}>
                <td>{tour.name}</td>
                <td>{tour.location}</td>
                <td>{tour.date}</td>
                <td>{tour.participant}</td>
                <td>
                  <button className="evaluate-button">Evaluate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (selectedType === "Fairs") {
      return (
        <table className="tour-table">
          <thead>
            <tr>
              <th>Fair Name</th>
              <th>Location</th>
              <th>Date</th>
              <th>Organizer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTours.map((fair) => (
              <tr key={fair.id}>
                <td>{fair.name}</td>
                <td>{fair.location}</td>
                <td>{fair.date}</td>
                <td>{fair.organizer}</td>
                <td>
                  <button className="evaluate-button">Evaluate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } 
  };

  return (
    <div className="home-layout">
      <nav className="sidebar">
        <div className="logo-container">
          <div className="logo">
            <img
              src="/bilkent.png?height=60&width=60"
              alt="University Logo"
              className="logo-image"
            />
            <div className="logo-text">
              <h1>BILFO</h1>
              <p>Bilkent Information Office</p>
            </div>
          </div>
        </div>

        <div className="nav-links">
          <a href="/profile" className="nav-link">
            Profile
          </a>
          <a className="nav-link" onClick={goToTourFairList}>
            Tours and Fairs
          </a>

          {statusUser !== "GUIDE" && (
            <a className="nav-link" onClick={goToGuideList}>
              Guide List
            </a>
          )}

          <a href="/puantaj" className="nav-link">
            Puantaj Table
          </a>
          <a href="/logout" className="nav-link">
            Log Out
          </a>
        </div>

        <div className="language-switcher">
          <img
            src="/Flag_England.png?height=32&width=40"
            alt="English"
            className="language-icon"
          />
          <img
            src="/Flag_of_Turkey.png?height=32&width=40"
            alt="Turkish"
            className="language-icon"
          />
        </div>
      </nav>

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
    </div>
  );
}
