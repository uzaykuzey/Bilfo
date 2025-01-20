import React, { useState } from 'react';
import api from "./api/axios_config";
import './edit_event.css';

const EditEvent = () => {
    const [formData, setFormData] = useState(null);
    const [editId, setEditId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCancelPopup, setShowCancelPopup] = useState(false);

    // Fetch event details by ID
    const handleIdSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get("/form/getEventDetails", {
                params: { editId }
            });
            console.log(response.data);
            if (response.data) {
                setFormData(response.data);
                setError('');
            } else {
                setError('Event not found');
            }
        } catch (err) {
            setError('Invalid ID or event not found');
            setFormData(null);
        }
    };

    // Confirm cancel
    const handleCancelEvent = async () => {
        try {
            const response = await api.post(`/event/cancelEvent`, {
                formId: formData.first?.id
            });
            if (response.status === 200) {
                setSuccess('Event canceled successfully');
                setShowCancelPopup(false);
                setTimeout(() => window.location.href = '/', 2000);
            } else {
                setError('Failed to cancel event');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel event');
        }
    };

    return (
        <div className="home-layout">
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
                    <a href="/login" className="nav-link" id="login">Log In</a>
                </div>

                
            </nav>
            <div className="edit-event-container">
                <h2>Cancel Event</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
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
                    <div className="button-group">
                        <button type="submit" className="submit-button">
                            Verify ID
                        </button>
                        {formData && (
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => setShowCancelPopup(true)}
                            >
                                Cancel Event
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Cancel Confirmation Popup */}
            {showCancelPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Cancel Event</h3>
                        <p>Are you sure you want to cancel this event?</p>
                        <div className="popup-buttons">
                            <button
                                onClick={handleCancelEvent}
                                className="popup-confirm-button"
                            >
                                Yes, Cancel
                            </button>
                            <button
                                onClick={() => setShowCancelPopup(false)}
                                className="popup-cancel-button"
                            >
                                No, Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditEvent;
