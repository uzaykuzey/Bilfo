import { useEffect, useState } from "react";
import NavbarLayout from "./navbar";
import api from "./api/axios_config";
import dayjs from "dayjs";
import "./puantaj_table_guide.css";

export default function PuantajTableGuideLayout() {
    const [guideList, setGuideList] = useState([]); // State variable to store the response
    const [currentMonth, setCurrentMonth] = useState(dayjs()); // Initialize with current date

    // Fetch data whenever the currentMonth changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/log/getAllGuidesLogTable", {
                    params: { date: currentMonth.format("YYYY-MM") + "-01" },
                });
                setGuideList(response.data); // Store response data in state
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [currentMonth]);

    // Handle previous and next month navigation
    const handlePreviousMonth = () => {
        setCurrentMonth((prev) => prev.subtract(1, "month"));
    };

    const handleNextMonth = () => {
        setCurrentMonth((prev) => prev.add(1, "month"));
    };

    return (
        <div className="home-layout">
            <NavbarLayout />
            <div className="content">
            <h1>Guide Logs</h1>
            <div className="month-navigation">
                <button onClick={handlePreviousMonth} className="month-btn">◀ Previous</button>
                <span className="current-month">{currentMonth.format("MMMM YYYY")}</span>
                <button onClick={handleNextMonth} className="month-btn">Next ▶</button>
            </div>

            <div className="log-table-container">
                {guideList.length > 0 ? (
                    <table className="log-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Bilkent ID</th>
                                <th>Trainee</th>
                                <th>Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guideList.map((guide, index) => (
                                <tr key={index}>
                                    <td>{guide.first?.username}</td>
                                    <td>{guide.first?.bilkentId}</td>
                                    <td>{guide.first?.trainee ? "Yes" : "No"}</td>
                                    <td>{guide.second}</td>
                                    <td>
                                        <button 
                                            className="details-btn" 
                                            onClick={() => handleDetailsClick(guide)}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data-message">No logs found for this month.</p>
                )}
            </div>
            </div>
        </div>
    );
}
