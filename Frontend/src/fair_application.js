import React, { useState, useEffect } from 'react';
import api from "./api/axios_config.js";
import './fair_application.css';
import './terms_conditions.css';

export default function FairApplicationForm() {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [schoolsList, setSchoolsList] = useState([]);
    const [isTermsPopupOpen, setIsTermsPopupOpen] = useState(false);
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
            contactMail: formData.contactInfo
        };
        
        try {
            const response = await api.post("/form/fairform", fairFormData);
            
            if (response.status == 201) {
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

    const openTermsPopup = (e) => {
        e.preventDefault();
        setIsTermsPopupOpen(true);
    };

    const closeTermsPopup = () => {
        setIsTermsPopupOpen(false);
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
                    <a href="/edit_event" className="nav-link">Cancel Event</a>
                    <a href="/feedback" className="nav-link">Feedback</a>
                    <a href="/login" className="nav-link" id = "login">Log In</a>
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
                        <span>
                            I have read and accepted the <a href="#" onClick={openTermsPopup} className="terms-link">Terms & Conditions</a>
                        </span>
                        {formData.formErrors.termsAccepted && (
                            <span className="error">{formData.formErrors.termsAccepted}</span>
                        )}
                        
                    </div>

                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </form>
            </div>

            {isTermsPopupOpen && (
                <div className="popup-overlay-terms">
                    <div className="popup-content-terms">
                        <h3 id = "terms-header">Terms and Conditions</h3>
                        <div className='terms'>
                        <p className= 'term'><strong>Acknowledgment:</strong></p>
                        <p className= 'term'>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service. Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users, and others who access or use the Service. By accessing or using the Service, You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions, then You may not access the Service. Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.</p>
                        <p className= 'term'><strong>Interpretation and Definitions:</strong></p>
                        <p className= 'term'>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural. For the purposes of these Terms and Conditions: <strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote for election of directors or other managing authority. 
                        <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Bilkent University, Bilkent Üniversitesi 06800 Bilkent/Ankara/TÜRKİYE. <strong>Service</strong> refers to the Website. <strong>Terms and Conditions</strong> (also referred to as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service. This Terms and Conditions agreement has been created with the help of the Terms and Conditions Generator. <strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
                        <p className= 'term'><strong>Smoke-Free Campus Policy:</strong></p>
                        <p className= 'term'>Effective as of September 1, 2022, and pursuant to the April 25, 2018, Bilkent University Senate and University Executive Board Decision, Bilkent University has adopted a Smoke-Free Campus Policy to promote a healthy and civilized university environment for all stakeholders. As part of this policy: <strong>The use of cigarettes, other tobacco products, and electronic cigarettes is strictly prohibited in all indoor and outdoor areas of Bilkent University.</strong> Until the full implementation of the ban, smoking areas within the campus will be gradually restricted. By using the Service, you agree to comply with this Smoke-Free Campus Policy. Non-compliance may result in appropriate measures as determined by the University.</p>
                        <p className= 'term'><strong>Campus Traffic Rules:</strong></p>
                        <p className= 'term'>Speed Limits: The maximum allowable speed for vehicles operating on the campus is 50 kilometers per hour (km/h) unless otherwise indicated by traffic signs. At intersections or areas approaching pedestrian crossings, the speed limit is reduced to 30 kilometers per hour (km/h) to ensure safety. Pedestrian Right of Way: The principle granting pedestrians absolute priority at all designated pedestrian crossings within the campus. Vehicles must come to a complete stop behind crossing lines to allow pedestrians to pass unimpeded. Prohibited Vehicles: Driver Conduct: <strong>All drivers operating vehicles within the campus are required to:</strong> Adhere to instructions and directives issued by authorized security personnel. Refrain from actions that cause disturbance, including unnecessary use of horns, playing loud music, or disposing of trash from vehicles. Compliance with these rules is monitored through campus surveillance systems, including cameras, and enforced by authorized personnel. Non-compliance may result in penalties, including warnings, fines, or removal of access privileges to the campus.</p>
                        <p className= 'term'>For questions, email: tanitim@bilkent.edu.tr</p>
                        </div>
                        <button onClick={closeTermsPopup} className="close-terms">I Understand</button>
                    </div>
                
                </div>
            )}

        </div>
    );
}
