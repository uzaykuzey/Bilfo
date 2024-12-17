import React, { useState } from 'react';
import api from "./api/axios_config"
import './fair_application.css';

export default function FairApplicationLayout() {
    const [formData, setFormData] = useState({
        organization: '',
        date: '',
        time: '',
        city: '',
        contactInfo: '',
        termsAccepted: false,
        formErrors: {}
    });

    const timeOptions = ["9.00", "11.00", "13.00", "16.00"];
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
        if (!formData.organization) errors.organization = 'Please enter an organization.';
        if (!formData.date) errors.date = 'Please select a date.';
        if (!formData.time) errors.time = 'Please select a time.';
        if (!formData.city) errors.city = 'Please select a city.';
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
            schoolName: formData.organization,
            date: formData.date,
            time: formData.time,
            city: formData.city,
            contactMail: formData.contactInfo
        };
        try {
            // Make the API call
            const response = await api.post("/form/fairform", fairFormData);

            // Handle the API response
            if (response.status === 200) {
                setFormData({
                    organization: '',
                    date: '',
                    time: '',
                    city: '',
                    contactInfo: '',
                    termsAccepted: false,
                    formErrors: {}
                });
                alert("Form is sent!");
            } else {
                alert("Failed to send!");
            }
        } catch (error) {
            console.log(error)
            alert("Error occurred");
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
                    <a href="/feedback" className="nav-link">FeedBack</a>
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
                        Organization:
                        <input
                            type="text"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            required
                        />
                        {formData.formErrors.organization && (
                            <span className="error">{formData.formErrors.organization}</span>
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

                    <label>
                        City:
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select City</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        {formData.formErrors.city && (
                            <span className="error">{formData.formErrors.city}</span>
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
