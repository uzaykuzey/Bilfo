import React, { useState, useEffect } from 'react';
import api from "./api/axios_config.js";
import './fair_application.css';

export default function FairApplicationForm() {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [schoolsList, setSchoolsList] = useState([]);
    const [formData, setFormData] = useState({
        schoolName: '',
        city: '',
        district: '',
        date: '',
        time: '',
        contactInfo: '',
        termsAccepted: false,
        formErrors: {}
    });

    const timeOptions = ["9.00", "11.00", "13.00", "16.00"];

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
        if (!formData.schoolName) errors.schoolName = 'Please select a school.';
        if (!formData.date) errors.date = 'Please select a date.';
        if (!formData.time) errors.time = 'Please select a time.';
        if (!formData.contactInfo) errors.contactInfo = 'Please provide a contact email.';
        else if (!/\S+@\S+\.\S+/.test(formData.contactInfo)) errors.contactInfo = 'Please enter a valid email address.';
        if (!formData.termsAccepted) errors.termsAccepted = 'You must accept the terms and conditions.';
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

        const fairFormData = {
            schoolName: formData.schoolName,
            city: formData.city,
            district: formData.district,
            date: formData.date,
            time: formData.time,
            contactInfo: formData.contactInfo
        };

        try {
            const response = await api.post("/form/fairform", fairFormData);
            
            if (response.status === 200) {
                // Reset form after successful submission
                setFormData({
                    schoolName: '',
                    city: '',
                    district: '',
                    date: '',
                    time: '',
                    contactInfo: '',
                    termsAccepted: false,
                    formErrors: {}
                });
                alert("Form submitted successfully!");
            } else {
                alert("Failed to submit form!");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error submitting form!");
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
                    <a href="/" className="nav-link">Campus Tours</a>
                    <a href="/fair_application" className="nav-link">Fair Application</a>
                    <a href="/feedback" className="nav-link">Feedback</a>
                    <a href="/login" className="nav-link">Log In</a>
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
            <div className="form-container">
                <div className="form-header">
                    <h2>Submit Fair Application</h2>
                </div>
                <form onSubmit={handleSubmit} className="fair-application-form">
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
                        {formData.formErrors.schoolName && (
                            <span className="error">{formData.formErrors.schoolName}</span>
                        )}
                    </label>

                    <label>
                        Date:
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                        {formData.formErrors.date && (
                            <span className="error">{formData.formErrors.date}</span>
                        )}
                    </label>

                    <label>
                        Time:
                        <select
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Time</option>
                            {timeOptions.map((time, index) => (
                                <option key={index} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                        {formData.formErrors.time && (
                            <span className="error">{formData.formErrors.time}</span>
                        )}
                    </label>

                    {/* New Contact Info Field */}
                    <label>
                        Contact Info (Email):
                        <input
                            type="email"
                            name="contactInfo"
                            value={formData.contactInfo}
                            onChange={handleChange}
                            required
                        />
                        {formData.formErrors.contactInfo && (
                            <span className="error">{formData.formErrors.contactInfo}</span>
                        )}
                    </label>

                    <div class = "checkboxrow">
                        
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
