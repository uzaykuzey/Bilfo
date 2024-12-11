import "./tour_fair_list.css";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "./api/axios_config";

export default function TourListLayout() {
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const { statusUser } = state;
  const navigate = useNavigate();

  const [pendingTours, setPendingTours] = useState([]);
  const [acceptedTours, setAcceptedTours] = useState([]);
  const [rejectedTours, setRejectedTours] = useState([]);

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
        const pending = responseForm.data.filter(item => item.approved === "NOT_REVIEWED");
        const accepted = responseEvent.data.filter(item => item.approved === "ACCEPTED");
        const rejected = responseEvent.data.filter(item => item.approved === "REJECTED"); 
        setPendingTours(pending);
        setAcceptedTours(accepted);
        setRejectedTours(rejected);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchToursFairs();
  }, []);

  return (
    <div className="home-layout">
      {/* Sidebar Navigation */}
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
          <a href="/profile" className="nav-link">Profile</a>
          <a className="nav-link" onClick={goToTourFairList}>Tours and Fairs</a>

          {statusUser !== "GUIDE" && (
            <a className="nav-link" onClick={goToGuideList}>
              Guide List
            </a>
          )}

          <a href="/puantaj" className="nav-link">Puantaj Table</a>
          <a href="/logout" className="nav-link">Log Out</a>
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

      {/* Main Content */}
      <div className="main-content">
        <h2>Tours and Fairs</h2>
        <div className="tabs">
          <button className="tab-button">Pending Tours</button>
          <button className="tab-button">Accepted</button>
          <button className="tab-button">Rejected</button>
        </div>

        <div className="tour-list">
          {pendingTours.map((tour) => (
            <div className="tour-item" key={tour.id}>
              <span>{tour.location}</span>
              {console.log(tour.location)}
              <button className="evaluate-button">Evaluate</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
