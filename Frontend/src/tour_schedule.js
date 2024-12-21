      import NavbarLayout from "./navbar";
      import "./tour_schedule.css";
      import { useState, useEffect } from "react";
      import { useParams } from "react-router-dom";
      import DatePicker from "react-datepicker";
      import "react-datepicker/dist/react-datepicker.css";
      import api from "./api/axios_config";
      import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
      import { BiLoaderAlt } from "react-icons/bi"; // Loading icon
      import "bootstrap-icons/font/bootstrap-icons.css";
      import Popup from "reactjs-popup";
      import "reactjs-popup/dist/index.css";

      export default function ScheduleLayout() {
        const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStartDate(new Date()));
        const [tourSchedule, setTourSchedule] = useState([]);
        const [loading, setLoading] = useState(false);
        const [showCalendar, setShowCalendar] = useState(false);
        const [selectedEvent, setSelectedEvent] = useState(null);
        const [workHours, setWorkHours] = useState("");
        const { bilkentId } = useParams();
        const [isPopupOpen, setIsPopupOpen] = useState(false);
        const handleDateChange = (date) => {
          const mondayOfSelectedWeek = getWeekStartDate(date);
          setCurrentWeekStart(mondayOfSelectedWeek);
          setShowCalendar(false);
        };
        const openPopup = (event) => {
          setSelectedEvent(event);
          setWorkHours("");
          setIsPopupOpen(true);
        };

        const closePopup = () => {
          setIsPopupOpen(false);
          setSelectedEvent(null);
        };
        function getWeekStartDate(date) {
          const day = date.getUTCDay();
          const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
          const startOfWeek = new Date(date);
          startOfWeek.setUTCDate(diff);
          startOfWeek.setUTCHours(0, 0, 0, 0);
          return startOfWeek;
        }

        function formatWeekRange(startDate) {
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);

          const formatDayMonthYear = (date) =>
            `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString("default", {
              month: "long",
            })} ${date.getFullYear()}`;

          return `${formatDayMonthYear(startDate)} - ${formatDayMonthYear(endDate)}`;
        }

        function formatDateToYYYYMMDD(date) {
          return date.toISOString().split("T")[0];
        }

        useEffect(() => {
          fetchTourSchedule();
        }, [currentWeekStart]);

        const fetchTourSchedule = async () => {
          setLoading(true);
          try {
            const formattedDate = formatDateToYYYYMMDD(currentWeekStart);
            const response = await api.get("/event/getScheduleOfWeek", {
              params: { weekStartDate: formattedDate, bilkentId: bilkentId },
            });
            setTourSchedule(response.data);
          } catch (error) {
            console.error("Error fetching tour schedule:", error);
          } finally {
            setLoading(false);
          }
        };

        const handlePreviousWeek = () => {
          const previousWeek = new Date(currentWeekStart);
          previousWeek.setDate(currentWeekStart.getDate() - 7);
          setCurrentWeekStart(previousWeek);
        };

        const handleNextWeek = () => {
          const nextWeek = new Date(currentWeekStart);
          nextWeek.setDate(currentWeekStart.getDate() + 7);
          setCurrentWeekStart(nextWeek);
        };
      
        
        const handleWorkHoursSubmit = async () => {
          if (!isNaN(workHours)) {
      
            const eventId = selectedEvent.split(".")[1]; 
            const requestData = {
              eventId: eventId,
              bilkentId: bilkentId,
              hours: workHours, 
            };
            
            console.log(requestData);
      
            try {
              const response = await api.post("/log/addLog", requestData);
      
              if (response.status === 200) {
                console.log(`Work hours for event "${selectedEvent}" successfully set.`);
                closePopup(); // Close the popup after successful submission
              } else {
                alert("There was an error setting the work hours.");
              }
            } catch (error) {
              console.error("Error setting work hours:", error);
              alert("An error occurred while submitting the work hours.");
            }
          } else {
            alert("Please enter a valid number of hours.");
          }
        };

        return (
          <div className="home-layout">
            <NavbarLayout />
            <div className="schedule-container">
              <div className="calendar-header">
                <button onClick={handlePreviousWeek}>
                  <FaChevronLeft />
                </button>
                <h2>{formatWeekRange(currentWeekStart)}</h2>
                <button onClick={handleNextWeek}>
                  <FaChevronRight />
                </button>
                <div className="calendar-container" style={{ position: "relative" }}>
                  <i
                    className="bi bi-calendar"
                    onClick={() => setShowCalendar((prev) => !prev)}
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  ></i>
                  {showCalendar && (
                    <div className="calendar-dropdown">
                      <DatePicker
                        selected={currentWeekStart}
                        onChange={handleDateChange}
                        inline
                      />
                    </div>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="loading-icon">
                  <BiLoaderAlt className="spinner" style={{ fontSize: "2rem" }} />
                  <p>Loading schedule...</p>
                </div>
              ) : (
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Monday</th>
                      <th>Tuesday</th>
                      <th>Wednesday</th>
                      <th>Thursday</th>
                      <th>Friday</th>
                      <th>Saturday</th>
                      <th>Sunday</th>
                    </tr>
                  </thead>
                  <tbody>
                  {generateTimeSlots().map((timeSlot, timeIndex) => (
                    <tr key={timeSlot}>
                      <td>{timeSlot}</td>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                        (day, dayIndex) => (
                          <td
                            key={day}
                            style={getCellStyle(timeIndex, dayIndex)}
                            onClick={() => {
                              const event = tourSchedule[timeIndex * 7 + dayIndex];
                              if (event) {
                                // Calculate the event's full date and time
                                const eventDate = new Date(currentWeekStart);
                                eventDate.setDate(eventDate.getDate() + dayIndex);
                                
                                // Calculate the event's time by adding the timeSlot hour and minute
                                const timeSlot = generateTimeSlots()[timeIndex];
                                const [startTime, endTime] = timeSlot.split(" - ");
                                const [eventHour, eventMinute] = startTime.split(":");
                                eventDate.setHours(eventHour, eventMinute);
                                // Check if the event date and time are before the current date and time
                                if (eventDate < new Date()) {
                                  openPopup(event);
                                } else {
                                  alert("You can only open details for past events.");
                                }
                              }
                            }}
                          >
                            {renderScheduleForDay(timeIndex, dayIndex)}
                          </td>

                        )
                      )}
                    </tr>
                  ))}
                  </tbody>
                </table>
              )}
              <Popup open={isPopupOpen} onClose={closePopup} modal closeOnDocumentClick>
                  <div className="popup-content">
                    <h3>Event Details</h3>
                    {selectedEvent ? (
                      <p>{selectedEvent.split(".")[0]}</p> // Display the event name by splitting at the dot
                    ) : (
                      <p>No event selected</p> // Fallback in case selectedEvent is null
                    )}

                    <label>
                      Hours of Work:
                      <input
                        type="number"
                        step="0.1"
                        value={workHours}
                        onChange={(e) => setWorkHours(e.target.value)}
                        placeholder="Enter hours (e.g., 2.5)"
                      />
                    </label>

                    <div className="popup-actions">
                      <button onClick={handleWorkHoursSubmit}>Submit</button>
                      <button onClick={closePopup}>Close</button>
                    </div>
                  </div>
                </Popup>
            
            </div>
          </div>
        );

        function generateTimeSlots() {
          const times = [];
          let startHour = 8;
          let startMinute = 20;

          for (let i = 0; i < 11; i++) {
            let endHour = startHour;
            let endMinute = startMinute + 60;
            if (endMinute >= 60) {
              endHour++;
              endMinute -= 60;
            }

            const formattedTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(
              2,
              "0"
            )} - ${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
            times.push(formattedTime);

            startHour = endHour;
            startMinute = endMinute;
          }
          return times;
        }

        function renderScheduleForDay(timeIndex, dayIndex) {
          const event = tourSchedule[timeIndex * 7 + dayIndex];
          if (event) {
            const eventName = event.split('.')[0];
            return <div className="schedule-event">{eventName}</div>;
          }
          return null; // Return null if no event exists
        }

        function getCellStyle(timeIndex, dayIndex) {
          const event = tourSchedule[timeIndex * 7 + dayIndex];
          if (event && event.trim() !== "") {
            return {
              backgroundColor: "blue",
              color: "white",
              textAlign: "center",
              padding: "0.5rem",
              borderRadius: "5px",
            };
          }
          return {};
        }
      }
