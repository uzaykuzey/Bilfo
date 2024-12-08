import React, { useState } from 'react';
import api from "./api/axios_config.js"
import './school_tours.css';

export default function SchoolToursForm() {
    const [formData, setFormData] = useState({
        schoolName: '',
        city: '',
        firstTimeDate: '',
        firstTimeHour: '',
        secondTimeDate: '',
        secondTimeHour: '',
        thirdTimeDate: '',
        thirdTimeHour: '',
        numberOfVisitors: '',
        counsellorName: '',
        counsellorPhone: '',
        counsellorEmail: '',
        visitorNotes: '',
        termsAccepted: false,
        formErrors: {} // Store validation errors here
    });

    const timeOptions = ["9.00", "11.00", "13.30", "16.00"];
    const cities = [
        "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
        "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır",
        "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkâri", "Hatay",
        "Isparta", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya",
        "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya",
        "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van",
        "Yalova", "Yozgat", "Zonguldak", "Ardahan", "Bartın", "Bayburt"
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

    const validateForm = () => {
        const errors = {};

        // Email validation
        if (!formData.counsellorEmail || !/\S+@\S+\.\S+/.test(formData.counsellorEmail)) {
            errors.counsellorEmail = 'Please enter a valid email address.';
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
            counselorName: formData.counsellorName,
            phoneNo: formData.counsellorPhone,
            email: formData.counsellorEmail,
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
                    firstTimeDate: '',
                    firstTimeHour: '',
                    secondTimeDate: '',
                    secondTimeHour: '',
                    thirdTimeDate: '',
                    thirdTimeHour: '',
                    numberOfVisitors: '',
                    counsellorName: '',
                    counsellorPhone: '',
                    counsellorEmail: '',
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
                    <a href="/fair-application" className="nav-link">Fair Application</a>
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

            {/* Form Container */}
            <div className="form-container">
                <div className="form-header">
                    <h2>Submit Tour Application</h2>
                </div>
                <form onSubmit={handleSubmit} className="tour-form">
                    <label>
                        Name of the school:
                        <input
                            type="text"
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleChange}
                            required
                        />
                    </label>

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
                            name="counsellor"
                            value={formData.counsellor}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Counsellor's phone number:
                        <input
                            type="tel"
                            name="counsellorPhone"
                            value={formData.counsellorPhone}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Counsellor's e-mail:
                        <input
                            type="email"
                            name="counsellorEmail"
                            value={formData.counsellorEmail}
                            onChange={handleChange}
                            required
                        />
                        {formData.formErrors.counsellorEmail && (
                            <span className="error">{formData.formErrors.counsellorEmail}</span>
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

                    <label>
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
                    </label>

                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
