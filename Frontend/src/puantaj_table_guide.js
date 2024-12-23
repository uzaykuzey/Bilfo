import { useEffect, useState } from "react";
import NavbarLayout from "./navbar";
import api from "./api/axios_config";
import dayjs from "dayjs";
import "./puantaj_table_guide.css";

export default function PuantajTableGuideLayout() {
    const [guideList, setGuideList] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedGuideLogs, setSelectedGuideLogs] = useState([]);
    const [selectedGuideName, setSelectedGuideName] = useState("");
    const [isDetailsView, setIsDetailsView] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [selectedLogId, setSelectedLogId] = useState(null);
    const [selectedDetailsMonth, setSelectedDetailsMonth] = useState(dayjs());
    const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!isDetailsView) {
                    const response = await api.get("/log/getAllGuidesLogTable", {
                        params: { date: currentMonth.format("YYYY-MM") + "-01" },
                    });
                    setGuideList(response.data);
                    console.log("Fetched guide list:", response.data);
                } else {
                    const response = await api.get("/log/getLogs", {
                        params: {
                            bilkentId: selectedGuideName,
                            monthDate: selectedDetailsMonth.format("YYYY-MM") + "-01",
                        },
                    });
                    setSelectedGuideLogs(response.data);
                    console.log("Fetched logs for guide:", response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [currentMonth, selectedDetailsMonth, isDetailsView, selectedGuideName]);

    const handlePreviousMonth = () => {
        setCurrentMonth((prev) => prev.subtract(1, "month"));
    };

    const handleNextMonth = () => {
        setCurrentMonth((prev) => prev.add(1, "month"));
    };

    const handleDetailsPreviousMonth = () => {
        setSelectedDetailsMonth((prev) => prev.subtract(1, "month"));
    };

    const handleDetailsNextMonth = () => {
        setSelectedDetailsMonth((prev) => prev.add(1, "month"));
    };

    const handleDetailsClick = async (guide) => {
        if (guide.second > 0) {
            setSelectedGuideName(guide.first?.bilkentId);
            setIsDetailsView(true);
        } else {
            alert("No logs available for this user.");
        }
    };

    const handleBackClick = () => {
        setIsDetailsView(false);
        setSelectedGuideLogs([]);
        setSelectedGuideName("");
    };

    const handleRowClick = (rowId) => {
        if (selectedRowId === rowId) {
            setSelectedRowId(null);
        } else {
            setSelectedRowId(rowId);
        }
    };

    const handleLogRowClick = (logId) => {
        if (selectedLogId === logId) {
            setSelectedLogId(null);
        } else {
            setSelectedLogId(logId);
        }
    };

    const handleMarkAsPaid = async () => {
        if (selectedLogId !== null) {
            try {
                const selectedLog = selectedGuideLogs.find((log) => log.id === selectedLogId);
                if (selectedLog && selectedLog.first?.paid === false) {
                    const response = await api.post("/log/markLogAsPaid", {
                        logId: selectedLog.first?.id,
                    });
                    setSelectedGuideLogs((prevLogs) =>
                        prevLogs.map((log) =>
                            log.first?.id === selectedLog.first?.id ? { ...log, first: { ...log.first, paid: true } } : log
                        )
                    );
                    console.log("Paid status updated", response.data);
                } else {
                    alert("The selected log is already marked as paid.");
                }
            } catch (error) {
                console.error("Error updating paid status:", error);
            }
        } else {
            alert("Please select a log to mark as paid.");
        }
    };

    const handleMarkAllAsPaid = () => {
        setIsPopupVisible(true); // Show the confirmation popup
    };

    const handleConfirmMarkAllAsPaid = async () => {
        try {
            const response = await api.post("/log/markAllLogsAsPaid", {
                monthDate: currentMonth.format("YYYY-MM") + "-01",
            });
            console.log("All logs for the month marked as paid", response.data);
            setIsPopupVisible(false);
        } catch (error) {
            console.error("Error marking all logs as paid:", error);
        }
    };

    const handleCancelMarkAllAsPaid = () => {
        setIsPopupVisible(false); // Hide the popup if the user cancels
    };

    // Confirmation Popup Component
    const ConfirmationPopup = ({ onConfirm, onCancel }) => {
        return (
            <div className="popup-overlay">
                <div className="popup-content-puantajg">
                    <h3>Are you sure you want to mark all logs as paid?</h3>
                    <div className="popup-buttons">
                        <button onClick={onConfirm} className="confirm-btn">Confirm</button>
                        <button onClick={onCancel} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="home-layout">
            <NavbarLayout />
            {!isDetailsView ? (
                <div className="content-puantaj">
                    <h1>Guide Logs</h1>

                    <div className="month-navigation">
                        <button onClick={handlePreviousMonth} className="month-btn">◀</button>
                        <span className="current-month">{currentMonth.format("MMMM YYYY")}</span>
                        <button onClick={handleNextMonth} className="month-btn">▶</button>
                    </div>

                    <div className="mark-all-paid-container">
                        <button onClick={handleMarkAllAsPaid} className="mark-all-paid-btn">
                            Mark All as Paid
                        </button>
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
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guideList.map((guide, index) => (
                                        <tr
                                            key={index}
                                            className={selectedRowId === guide.first?.bilkentId ? "selected-row" : ""}
                                            onClick={() => handleRowClick(guide.first?.bilkentId)}
                                        >
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

                    {/* Confirmation popup for Mark All as Paid */}
                    {isPopupVisible && (
                        <ConfirmationPopup
                            onConfirm={handleConfirmMarkAllAsPaid}
                            onCancel={handleCancelMarkAllAsPaid}
                        />
                    )}
                </div>
            ) : (
                <div className="log-details-container">
                    <div className="guide-logs-header">
                        <h1>Guide Logs</h1>
                        <h2>Logs for {selectedGuideName}</h2>
                        
                        <div className="month-navigation">
                            <button onClick={handleDetailsPreviousMonth} className="month-btn">◀</button>
                            <span className="current-month">{selectedDetailsMonth.format("MMMM YYYY")}</span>
                            <button onClick={handleDetailsNextMonth} className="month-btn">▶</button>
                        </div>

                        <div className="header-actions">
                            <button onClick={handleBackClick} className="back-button">Back</button>
                            <button
                                onClick={handleMarkAsPaid}
                                className="mark-as-paid-button"
                                disabled={selectedLogId === null}
                            >
                                Mark as Paid
                            </button>
                        </div>
                    </div>

                    <table className="guide-logs-table">
                        <thead>
                            <tr>
                                <th>Activity Name</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedGuideLogs.map((log, index) => (
                                <tr
                                    key={index}
                                    className={selectedLogId === log.id ? "selected-row" : ""}
                                    onClick={() => handleLogRowClick(log.id)}
                                >
                                    <td>
                                        {log.third?.type === "HIGHSCHOOL_TOUR" && log.third?.schoolName}
                                        {log.third?.type === "INDIVIDUAL_TOUR" && "Individual Tour"}
                                        {log.third?.type === "FAIR" && log.third?.schoolName}
                                    </td>
                                    <td>
                                        {log.third?.type === "HIGHSCHOOL_TOUR" && "High School Tour"}
                                        {log.third?.type === "INDIVIDUAL_TOUR" && "Individual Tour"}
                                        {log.third?.type === "FAIR" && "Fair"}
                                    </td>
                                    <td>{log.first?.date ? dayjs(log.first?.date).format("DD.MM.YY") : ""}</td>
                                    <td className={log.first?.paid ? "status-paid" : "status-unpaid"}>
                                        {log.first?.paid ? "Paid" : "Unpaid"}
                                    </td>
                                    <td>{log.first?.hours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Restore confirmation popup */}
                    {isPopupVisible && (
                        <ConfirmationPopup
                            onConfirm={handleConfirmMarkAllAsPaid}
                            onCancel={handleCancelMarkAllAsPaid}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
