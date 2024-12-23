import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "./suggested_tours.css";
import NavbarLayout from "./navbar";
import { useParams } from "react-router-dom";
import api from "./api/axios_config";

export default function SuggestedToursLayout() {
    const [highschoolTours, setHighschoolTours] = useState([]);
    const [individualTours, setIndividualTours] = useState([]);
    const [selectedTourId, setSelectedTourId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const { bilkentId } = useParams();

    useEffect(() => {
        async function fetchTours() {
            try {
                const response = await api.get("/event/getSuggestedEvents", { params: { bilkentId } });
                const data = response.data;
                console.log(data[0].second?.id);
                const highschool = data.filter(tour => tour.second?.type === "HIGHSCHOOL_TOUR");
                const individual = data.filter(tour => tour.second?.type === "INDIVIDUAL_TOUR");

                setHighschoolTours(highschool);
                setIndividualTours(individual);
            } catch (error) {
                console.error("Failed to fetch tours:", error);
            }
        }

        fetchTours();
    }, [bilkentId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
        }).format(date);
    };

    const formatTime = (timeString) => {
        const timeMap = {
            NINE_AM: "09:00 AM",
            ELEVEN_AM: "11:00 AM",
            ONETHIRTY_PM: "01:30 PM",
            FOUR_PM: "04:00 PM"
        };
        return timeMap[timeString] || timeString;
    };

    const handleConfirmClaim = async (tourId, close) => {
        try {
            console.log(`Claiming tour with ID: ${tourId}`);
            const response = await api.post(`/event/claimEvent`, { bilkentId: bilkentId, formId: tourId });
            if (response.status === 200) {
                setSuccessMessage("Tour successfully claimed!");
                setTimeout(() => setSuccessMessage(""), 3000); // Hide message after 3 seconds
            }
    
            // Update the tour lists
            setHighschoolTours(prev => prev.filter(tour => tour.second?.id !== tourId));
            setIndividualTours(prev => prev.filter(tour => tour.second?.id !== tourId));
            close();
        } catch (error) {
            console.error("Failed to claim tour:", error);
        }
    };

    const handleReject = async (tourId, close) => {
        try {
            console.log(`Rejecting tour with ID: ${tourId}`);
            const response = await api.post(`/event/rejectSuggestedEvent`, { bilkentId: bilkentId, eventId: tourId });
            if (response.status === 200) {
                setSuccessMessage("Tour successfully rejected!");
                setTimeout(() => setSuccessMessage(""), 3000); // Hide message after 3 seconds
            }

            // Update the tour lists
            setHighschoolTours(prev => prev.filter(tour => tour.first?.id !== tourId));
            setIndividualTours(prev => prev.filter(tour => tour.first?.id !== tourId));
            close();
        } catch (error) {
            console.error("Failed to reject tour:", error);
        }
    };

    return (
        <div className="home-layout">
            <NavbarLayout />
            <div className="content-list">
                <h1 id = "suggested-header">Suggested Tours</h1>
                {/* Success Message */}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <div className="table-container">
                    {/* Highschool Tours Table */}
                    <div className="table-section">
                        <h2>Highschool Tours</h2>
                        {highschoolTours.length === 0 ? (
                            <p>No highschool tours have been suggested.</p>
                        ) : (
                            <table className="tour-table">
                                <thead>
                                    <tr>
                                        <th>School Name</th>
                                        <th>City</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Visitor Count</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {highschoolTours.map(tour => (
                                        <tr key={tour.second?.id}>
                                            <td>{tour.second?.schoolName}</td>
                                            <td>{tour.second?.city}</td>
                                            <td>{formatDate(tour.first?.date)}</td>
                                            <td>{formatTime(tour.first?.time)}</td>
                                            <td>{tour.second?.visitorCount}</td>
                                            <td>
                                                <Popup
                                                    trigger={<button>Claim</button>}
                                                    modal
                                                    nested
                                                >
                                                    {close => (
                                                        <div className="popup-content">
                                                            <h3>Confirm Claim</h3>
                                                            <p>Are you sure you want to claim this tour?</p>
                                                            <button onClick={() => handleConfirmClaim(tour.second?.id, close)}>Yes, Claim</button>
                                                            <button onClick={close}>Cancel</button>
                                                        </div>
                                                    )}
                                                </Popup>
                                                <Popup
                                                    trigger={<button>Reject</button>}
                                                    modal
                                                    nested
                                                >
                                                    {close => (
                                                        <div className="popup-content">
                                                            <h3>Confirm Rejection</h3>
                                                            <p>Are you sure you want to reject this tour?</p>
                                                            <button onClick={() => handleReject(tour.first?.id, close)}>Yes, Reject</button>
                                                            <button onClick={close}>Cancel</button>
                                                        </div>
                                                    )}
                                                </Popup>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Individual Tours Table */}
                    <div className="table-section">
                        <h2>Individual Tours</h2>
                        {individualTours.length === 0 ? (
                            <p>No individual tours have been suggested.</p>
                        ) : (
                            <table className="tour-table">
                                <thead>
                                    <tr>
                                        <th>Names</th>
                                        <th>Department</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Visitor Count</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {individualTours.map(tour => (
                                        <tr key={tour.second?.id}>
                                            <td>
                                                {tour.second?.names.slice(0, 3).join(", ")}
                                                {tour.second?.names.length > 3 ? "..." : ""}
                                            </td>
                                            <td>{tour.second?.department}</td>
                                            <td>{formatDate(tour.first?.date)}</td>
                                            <td>{formatTime(tour.first?.time)}</td>
                                            <td>{tour.second?.visitorCount}</td>
                                            <td>
                                                <Popup
                                                    trigger={<button>Claim</button>}
                                                    modal
                                                    nested
                                                >
                                                    {close => (
                                                        <div className="popup-content">
                                                            <h3>Confirm Claim</h3>
                                                            <p>Are you sure you want to claim this tour?</p>
                                                            <button onClick={() => handleConfirmClaim(tour.second?.id, close)}>Yes, Claim</button>
                                                            <button onClick={close}>Cancel</button>
                                                        </div>
                                                    )}
                                                </Popup>
                                                <Popup
                                                    trigger={<button>Reject</button>}
                                                    modal
                                                    nested
                                                >
                                                    {close => (
                                                        <div className="popup-content">
                                                            <h3>Confirm Rejection</h3>
                                                            <p>Are you sure you want to reject this tour?</p>
                                                            <button onClick={() => handleReject(tour.first?.id, close)}>Yes, Reject</button>
                                                            <button onClick={close}>Cancel</button>
                                                        </div>
                                                    )}
                                                </Popup>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
