import React, { useState, useEffect } from 'react';
import api from "./api/axios_config.js"
import './school_tours.css';

export default function SchoolToursForm() {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [schoolsList, setSchoolsList] = useState([]);
    const [formData, setFormData] = useState({
        schoolName: '',
        city: '',
        district: '',
        firstTimeDate: '',
        firstTimeHour: '',
        secondTimeDate: '',
        secondTimeHour: '',
        thirdTimeDate: '',
        thirdTimeHour: '',
        numberOfVisitors: '',
        counselorName: '',
        counselorPhone: '',
        counselorEmail: '',
        visitorNotes: '',
        termsAccepted: false,
        formErrors: {} // Store validation errors here
    });

    const timeOptions = ["9.00", "11.00", "13.30", "16.00"];
    

    // Fetch cities on component mount
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await api.get("/school/cityNames");
                setCities(response.data);
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            }
        };
        fetchCities();
    }, []);

    // Fetch districts when city changes
    useEffect(() => {
        const fetchDistricts = async () => {
            if (formData.city) {
                try {
                    const response = await api.get(`/school/districtNames?city=${formData.city}`);
                    setDistricts(response.data);
                    // Reset district and school when city changes
                    setFormData(prev => ({ ...prev, district: '', schoolName: '' }));
                } catch (error) {
                    console.error("Failed to fetch districts:", error);
                }
            }
        };
        fetchDistricts();
    }, [formData.city]);

    // Fetch schools when district changes
    useEffect(() => {
        const fetchSchools = async () => {
            if (formData.city && formData.district) {
                try {
                    const response = await api.get(`/school/schoolNames?city=${formData.city}&district=${formData.district}`);
                    setSchoolsList(response.data);
                    // Reset school when district changes
                    setFormData(prev => ({ ...prev, schoolName: '' }));
                } catch (error) {
                    console.error("Failed to fetch schools:", error);
                }
            }
        };
        fetchSchools();
    }, [formData.district]);

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

    const validateForm = () => {
        const errors = {};

        // Email validation
        if (!formData.counselorEmail || !/\S+@\S+\.\S+/.test(formData.counselorEmail)) {
            errors.counselorEmail = 'Please enter a valid email address.';
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
        } 
        const schoolFormData = {
            schoolName: formData.schoolName,
            city: formData.city,
            date1: formData.firstTimeDate,
            time1: formData.firstTimeHour,
            date2: formData.secondTimeDate,
            time2: formData.secondTimeHour,
            date3: formData.thirdTimeDate,
            time3: formData.thirdTimeHour,
            visitorCount: formData.numberOfVisitors,
            counselorName: formData.counselorName,
            phoneNo: formData.counselorPhone,
            email: formData.counselorEmail,
            visitorNotes: formData.visitorNotes
        };
        try {
            // Make the API call
            const response = await api.post("/form/hsform", schoolFormData);
    
            // Handle the API response
            if (response.status === 200) {
                setFormData({
                    schoolName: '',
                    city: '',
                    district: '',
                    firstTimeDate: '',
                    firstTimeHour: '',
                    secondTimeDate: '',
                    secondTimeHour: '',
                    thirdTimeDate: '',
                    thirdTimeHour: '',
                    numberOfVisitors: '',
                    counselorName: '',
                    counselorPhone: '',
                    counselorEmail: '',
                    visitorNotes: '',
                    termsAccepted: false,
                    formErrors: {}
                });
                alert("Form is sent!");
            } else {
                alert("Failed to send!");
            }
        } catch (error) {
            // Handle errors from the API
            alert("Error occurred");
        }
    };

    return (
        <div className="home-layout">
            {/* Sidebar Component */}
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
                    <a href="/fair_application" className="nav-link">Fair Application</a>
                    <a href="/feedback" className="nav-link">FeedBack</a>
                    <a href="/login" className="nav-link" id = "login">Log In</a>
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

            {/* Form Container */}
            <div className="form-container">
                <div className="form-header">
                    <h2>Submit Tour Application</h2>
                </div>
                <form onSubmit={handleSubmit} className="tour-form">
                    <label>
                        City:
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        District:
                        <select
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                            disabled={!formData.city}
                        >
                            <option value="">Select District</option>
                            {districts.map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        School Name:
                        <select
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleChange}
                            required
                            disabled={!formData.district}
                        >
                            <option value="">Select School</option>
                            {schoolsList.map((school) => (
                                <option key={school} value={school}>
                                    {school}
                                </option>
                            ))}
                        </select>
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
                            onChange={handleChange}
                            required
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
                            onChange={handleChange}
                            required
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
                            onChange={handleChange}
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
                        Counsellor:
                        <input
                            type="text"
                            name="counselorName"
                            value={formData.counselorName}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Counsellor's phone number:
                        <input
                            type="tel"
                            name="counselorPhone"
                            value={formData.counselorPhone}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Counsellor's e-mail:
                        <input
                            type="email"
                            name="counselorEmail"
                            value={formData.counselorEmail}
                            onChange={handleChange}
                            required
                        />
                        {formData.formErrors.counselorEmail && (
                            <span className="error">{formData.formErrors.counselorEmail}</span>
                        )}
                    </label>

                    <label>
                        Visitor notes:
                        <textarea
                            name="visitorNotes"
                            value={formData.visitorNotes}
                            onChange={handleChange}
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
                        I have read and accepted the <a href="/terms-conditions">Terms & Conditions</a>
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
