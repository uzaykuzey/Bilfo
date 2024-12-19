import React, { useState } from 'react';
import api from "./api/axios_config.js";
import './individual_tours.css';

export default function IndividualToursForm() {
    const [formData, setFormData] = useState({
        applicantNames: '',
        firstTimeDate: '',
        firstTimeHour: '',
        secondTimeDate: '',
        secondTimeHour: '',
        thirdTimeDate: '',
        thirdTimeHour: '',
        numberOfVisitors: '',
        majorOfInterest: '',
        contactEmail: '',
        visitorNotes: '',
        termsAccepted: false,
        formErrors: {}, // Store validation errors here
        selectedTimeSlots: {} // Track selected time slots
    });

    const timeOptions = ["9.00", "11.00", "13.30", "16.00"];
    const majors = [
        "AMER", "ARCH", "CHEM", "COMD", "CS", "CTIS", "ECON", "EDU", "EEE", "ELIT",
        "FA", "GRA", "HART", "IAED", "IE", "IR", "LAUD", "LAW", "MAN", "MATH", "MBG",
        "ME", "MSC", "PHIL", "PHYS", "POLS", "PSYC", "THEA", "THM", "THR", "TRIN"
    ];
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            termsAccepted: e.target.checked
        });
    };

    const handleTimeChange = (e) => {
        const { name, value } = e.target;

        // Check if the selected time is already taken for that day
        const date = name.split("Time")[0]; // Get the date part of the field name
        const selectedTimeSlots = formData.selectedTimeSlots;
        
        if (selectedTimeSlots[date] && selectedTimeSlots[date].includes(value)) {
            setFormData({
                ...formData,
                formErrors: {
                    ...formData.formErrors,
                    [name]: `The time slot ${value} is already taken for ${date}. Please choose a different time.`
                }
            });
            return;
        }

        // If no errors, update the selected time slot
        setFormData({
            ...formData,
            [name]: value,
            selectedTimeSlots: {
                ...selectedTimeSlots,
                [date]: selectedTimeSlots[date] ? [...selectedTimeSlots[date], value] : [value]
            },
            formErrors: {
                ...formData.formErrors,
                [name]: '' // Clear any previous error for the selected field
            }
        });
    };

    const validateForm = () => {
        const errors = {};

        // Email validation
        if (!formData.contactEmail || !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
            errors.contactEmail = 'Please enter a valid email address.';
        }

        // Number of visitors validation
        if (!formData.numberOfVisitors || formData.numberOfVisitors <= 0) {
            errors.numberOfVisitors = 'Number of visitors must be greater than 0.';
        }

        // Terms acceptance validation
        if (!formData.termsAccepted) {
            errors.termsAccepted = 'You must accept the terms and conditions.';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormData({
                ...formData,
                formErrors: errors
            });
            return;
        }

        const individualFormData = {
            names: formData.applicantNames,
            date1: formData.firstTimeDate,
            time1: formData.firstTimeHour,
            date2: formData.secondTimeDate,
            time2: formData.secondTimeHour,
            date3: formData.thirdTimeDate,
            time3: formData.thirdTimeHour,
            visitorCount: formData.numberOfVisitors,
            department: formData.majorOfInterest,
            contactMail: formData.contactEmail,
            visitorNotes: formData.visitorNotes
        };

        try {
            const response = await api.post("/form/indform", individualFormData);

            if (response.status === 201) {
                setFormData({
                    applicantNames: '',
                    firstTimeDate: '',
                    firstTimeHour: '',
                    secondTimeDate: '',
                    secondTimeHour: '',
                    thirdTimeDate: '',
                    thirdTimeHour: '',
                    numberOfVisitors: '',
                    majorOfInterest: '',
                    contactEmail: '',
                    visitorNotes: '',
                    termsAccepted: false,
                    formErrors: {},
                    selectedTimeSlots: {} // Clear selected slots after submission
                });
                alert("Form successfully submitted!");
            } else {
                alert("Failed to submit form.");
            }
        } catch (error) {
            alert("An error occurred while submitting the form.");
        }
    };

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
                    <a href="/campus_tours" className="nav-link">Campus Tours</a>
                    <a href="/fair-application" className="nav-link">Fair Application</a>
                    <a href="/feedback" className="nav-link">FeedBack</a>
                    <a href="/login" className="nav-link">Log In</a>
                </div>
            </nav>

            {/* Form Container */}
            <div className="form-container">
                <div className="form-header">
                    <h2>Submit Individual Tour Application</h2>
                </div>
                <form onSubmit={handleSubmit} className="tour-form">
                    <label>
                        Names of applicants:
                        <input
                            type="text"
                            name="applicantNames"
                            value={formData.applicantNames}
                            onChange={handleChange}
                            placeholder="Name 1, Name 2, Name 3"
                            required
                        />
                    </label>

                    <label>
                        First time preference (date):
                        <input
                            type="date"
                            name="firstTimeDate"
                            value={formData.firstTimeDate}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        First time preference (hour):
                        <select
                            name="firstTimeHour"
                            value={formData.firstTimeHour}
                            onChange={handleTimeChange}
                            required
                        >
                            <option value="">Select Hour</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                        {formData.formErrors.firstTimeHour && (
                            <span className="error">{formData.formErrors.firstTimeHour}</span>
                        )}
                    </label>

                    <label>
                        Second time preference (date):
                        <input
                            type="date"
                            name="secondTimeDate"
                            value={formData.secondTimeDate}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Second time preference (hour):
                        <select
                            name="secondTimeHour"
                            value={formData.secondTimeHour}
                            onChange={handleTimeChange}
                            required
                        >
                            <option value="">Select Hour</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                        {formData.formErrors.secondTimeHour && (
                            <span className="error">{formData.formErrors.secondTimeHour}</span>
                        )}
                    </label>

                    <label>
                        Third time preference (date):
                        <input
                            type="date"
                            name="thirdTimeDate"
                            value={formData.thirdTimeDate}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Third time preference (hour):  
                        <select
                            name="thirdTimeHour"
                            value={formData.thirdTimeHour}
                            onChange={handleTimeChange}
                        >
                            <option value="">Select Hour</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Number of visitors:
                        <input
                            type="number"
                            name="numberOfVisitors"
                            value={formData.numberOfVisitors}
                            onChange={handleChange}
                            required
                        />
                        {formData.formErrors.numberOfVisitors && (
                            <span className="error">{formData.formErrors.numberOfVisitors}</span>
                        )}
                    </label>

                    <label>
                        Major of interest:
                        <select
                            name="majorOfInterest"
                            value={formData.majorOfInterest}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Major</option>
                            {majors.map((major) => (
                                <option key={major} value={major}>
                                    {major}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Contact email:
                        <input
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            required
                        />
                        {formData.formErrors.contactEmail && (
                            <span className="error">{formData.formErrors.contactEmail}</span>
                        )}
                    </label>

                    <label>
                        Visitor notes:
                        <textarea
                            name="visitorNotes"
                            value={formData.visitorNotes}
                            onChange={handleChange}
                            placeholder="Add any notes for your visit..."
                        />
                    </label>

                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleCheckboxChange}
                            required
                        />
                        <span>I have read and accepted the <a href="/terms-conditions">Terms & Conditions</a></span>
                        {formData.formErrors.termsAccepted && (
                            <span className="error">{formData.formErrors.termsAccepted}</span>
                        )}
                    </div>

                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
