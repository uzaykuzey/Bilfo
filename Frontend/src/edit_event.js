import React, { useState } from 'react';
import api from "./api/axios_config.js";
import './edit_event.css';

const EditEvent = () => {
    const [formData, setFormData] = useState(null);
    const [editId, setEditId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const timeOptions = ["9.00", "11.00", "13.30", "16.00"];

    const handleIdSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get(`/form/getEventDetails/${editId}`);
            if (response.data) {
                setFormData(response.data);
                setError('');
            }
        } catch (error) {
            setError('Invalid ID or event not found');
            setFormData(null);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/form/updateEvent', {
                editId: editId,
                ...formData
            });

            if (response.status === 200) {
                setSuccess('Event updated successfully');
                setTimeout(() => window.location.href = '/', 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update event');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
                    <a href="/edit_event" className="nav-link">Edit Event</a>
                    <a href="/feedback" className="nav-link">Feedback</a>
                    <a href="/login" className="nav-link" id="login">Log In</a>
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
            <div className="edit-event-container">
                {!formData ? (
                    // ID Verification Form
                    <>
                        <h2>Edit Event</h2>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleIdSubmit} className="id-form">
                            <div className="form-group">
                                <label>Please enter your Event ID:</label>
                                <input
                                    type="text"
                                    value={editId}
                                    onChange={(e) => setEditId(e.target.value)}
                                    required
                                    placeholder="Enter the ID from your email"
                                />
                            </div>
                            <button type="submit" className="submit-button">
                                Verify ID
                            </button>
                        </form>
                    </>
                ) : (
                    // Edit Form
                    <>
                        <h2>Edit Event Details</h2>
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
                        <form onSubmit={handleEdit} className="edit-form">
                            {/* Render form fields based on the event type */}
                            {formData.type === 'HIGHSCHOOL_TOUR' && (
                                <>
                                    <div className="form-group">
                                        <label>First Choice Date:</label>
                                        <input
                                            type="date"
                                            name="firstTimeDate"
                                            value={formData.firstTimeDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>First Choice Time:</label>
                                        <select
                                            name="firstTimeHour"
                                            value={formData.firstTimeHour}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {timeOptions.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Add other relevant fields based on your form structure */}
                                </>
                            )}
                            
                            {/* Add similar blocks for INDIVIDUAL_TOUR and FAIR_APPLICATION */}

                            <div className="button-group">
                                <button type="submit" className="submit-button">
                                    Update Event
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditEvent;
