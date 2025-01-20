import React, { useState } from 'react';
import api from "./api/axios_config.js";
import './individual_tours.css';
import './terms_conditions.css';

export default function IndividualToursForm() {
    const [isTermsPopupOpen, setIsTermsPopupOpen] = useState(false);
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
                    <a href="/campus_tours" className="nav-link">Campus Tours</a>
                    <a href="/fair_application" className="nav-link">Fair Application</a>
                    <a href="/edit_event" className="nav-link">Cancel Event</a>
                    <a href="/feedback" className="nav-link">Feedback</a>
                    <a href="/login" className="nav-link" id = "login">Log In</a>
                </div>
            </nav>

            {/* Form Container */}
            <div className="form-container">
                <div className="form-header">
                    <h2>Submit Individual Tour Application</h2>
                    <h3>* symbol denotes the mandatory fields to be filled</h3>
                </div>
                <form onSubmit={handleSubmit} className="tour-form">
                    <label>
                        *Names of applicants:
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
                        *First time preference (date):
                        <input
                            type="date"
                            name="firstTimeDate"
                            value={formData.firstTimeDate}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        *First time preference (hour):
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
                        />
                    </label>

                    <label>
                        Second time preference (hour):
                        <select
                            name="secondTimeHour"
                            value={formData.secondTimeHour}
                            onChange={handleTimeChange}
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
                        *Number of visitors:
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
                        *Major of interest:
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
                        *Contact email:
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
