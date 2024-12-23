import React, { useState } from 'react';
import api from "./api/axios_config";
import './edit_event.css';
import NavbarLayout from './navbar';

const EditEvent = () => {
    const [formData, setFormData] = useState(null);
    const [editId, setEditId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const timeOptions = ["9.00", "11.00", "13.30", "16.00"];

    // Fetch event details by ID
    const handleIdSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get("/form/getEventDetails", {
                params: { editId }
            });
            if (response.data) {
                console.log(response.data);
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

    // Update event details
    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/form/updateEvent', {
                editId,
                ...formData
            });

            if (response.status === 200) {
                setSuccess('Event updated successfully');
                setTimeout(() => window.location.href = '/', 2000);
            } else {
                setError('Failed to update event');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update event');
        }
    };

    // Cancel the event
    const handleCancelEvent = async () => {
        try {
            console.log(formData.first?.id);
            const response = await api.post(`/form/cancelEventCounselor`, {
                formId: formData.first?.id
        });
            if (response.status === 200) {
                setSuccess('Event canceled successfully');
                setTimeout(() => window.location.href = '/', 2000);
            } else {
                setError('Failed to cancel event');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel event');
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="home-layout">
            <NavbarLayout />

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
                            {/* Editable Fields */}
                            <div className="form-group">
                                <label>Event Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Event Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {formData.type === 'HIGHSCHOOL_TOUR' && (
                                <>
                                    <div className="form-group">
                                        <label>First Choice Date:</label>
                                        <input
                                            type="date"
                                            name="firstTimeDate"
                                            value={formData.firstTimeDate || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>First Choice Time:</label>
                                        <select
                                            name="firstTimeHour"
                                            value={formData.firstTimeHour || ''}
                                            onChange={handleInputChange}
                                        >
                                            {timeOptions.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Buttons */}
                            <div className="button-group">
                                <button type="submit" className="submit-button">
                                    Update Event
                                </button>
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={handleCancelEvent}
                                >
                                    Cancel Event
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
