import React, { useState, useEffect } from "react";
import "./suggested_tours.css";
import NavbarLayout from "./navbar";
import { useParams } from "react-router-dom";
import api from "./api/axios_config";

export default function SuggestedToursLayout() {
    const [highschoolTours, setHighschoolTours] = useState([]);
    const [individualTours, setIndividualTours] = useState([]);
    const { bilkentId } = useParams();

    useEffect(() => {
        async function fetchTours() {
            try {
                const response = await api.get("/event/getSuggestedEvents", { params: { bilkentId } });
                const data = response.data;
                console.log(data);
                const highschool = data.filter(tour => tour.second?.type === "HIGHSCHOOL_TOUR");
                const individual = data.filter(tour => tour.second?.type === "INDIVIDUAL_TOUR");

                setHighschoolTours(highschool);
                setIndividualTours(individual);
            } catch (error) {
                console.error("Failed to fetch tours:", error);
            }
        }

        fetchTours();
    }, []);

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

    const handleClaim = (id) => {
        console.log(`Claimed tour with ID: ${id}`);
    };

    const handleReject = (id) => {
        console.log(`Rejected tour with ID: ${id}`);
    };

    return (
        <div className="home-layout">
            <NavbarLayout />
            <h1>Suggested Tours</h1>
    
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
                                    <tr key={tour.first?.id}>
                                        <td>{tour.second?.schoolName}</td>
                                        <td>{tour.second?.city}</td>
                                        <td>{formatDate(tour.first?.date)}</td>
                                        <td>{formatTime(tour.first?.time)}</td>
                                        <td>{tour.second?.visitorCount}</td>
                                        <td>
                                            <button onClick={() => handleClaim(tour.id)}>Claim</button>
                                            <button onClick={() => handleReject(tour.id)}>Reject</button>
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
                                    <tr key={tour.first?.id}>
                                        <td>
                                            {tour.second?.names.slice(0, 3).join(", ")}
                                            {tour.second?.names.length > 3 ? "..." : ""}
                                        </td>
                                        <td>{tour.second?.department}</td>
                                        <td>{formatDate(tour.first?.date)}</td>
                                        <td>{formatTime(tour.first?.time)}</td>
                                        <td>{tour.second?.visitorCount}</td>
                                        <td>
                                            <button onClick={() => handleClaim(tour.id)}>Claim</button>
                                            <button onClick={() => handleReject(tour.id)}>Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
