import NavbarLayout from "./navbar";
import "./tour_schedule.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "./api/axios_config";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi"; // Loading icon
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ScheduleLayout() {
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStartDate(new Date()));
  const [tourSchedule, setTourSchedule] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading
  const [showCalendar, setShowCalendar] = useState(false);
  const { bilkentId } = useParams();

  const handleDateChange = (date) => {
    setCurrentWeekStart(date);
    setShowCalendar(false); // Close calendar after date selection
  };

  function getWeekStartDate(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  }

  function formatWeekRange(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const formatDayMonthYear = (date) =>
      `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

    if (startDate.getFullYear() === endDate.getFullYear()) {
      const formatDayMonth = (date) =>
        `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString("default", {
          month: "long",
        })}`;
      return `${formatDayMonth(startDate)} - ${formatDayMonth(endDate)} ${startDate.getFullYear()}`;
    } else {
      return `${formatDayMonthYear(startDate)} - ${formatDayMonthYear(endDate)}`;
    }
  }

  function formatDateToYYYYMMDD(date) {
    return date.toISOString().split("T")[0];
  }

  useEffect(() => {
    fetchTourSchedule();
  }, [currentWeekStart]);

  const fetchTourSchedule = async () => {
    setLoading(true); // Start loading
    try {
      const formattedDate = formatDateToYYYYMMDD(currentWeekStart);
      const response = await api.get("/event/getScheduleOfWeek", { params: { weekStartDate: formattedDate, bilkentId: bilkentId } });
      setTourSchedule(response.data);
    } catch (error) {
      console.error("Error fetching tour schedule:", error);
    } finally {
      setLoading(false); // End loading
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

  const handleDateSelection = (event) => {
    const selectedDate = new Date(event.target.value);
    setCurrentWeekStart(getWeekStartDate(selectedDate));
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
                      <td key={day} style={getCellStyle(timeIndex, dayIndex)}>
                        {renderScheduleForDay(timeIndex, dayIndex)}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
    return event ? <div className="schedule-event">{event}</div> : null;
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
