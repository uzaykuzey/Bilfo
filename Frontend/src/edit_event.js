import React, { useState } from 'react';
import api from "./api/axios_config.js";
import './edit_event.css';

const EditEvent = () => {
    const [step, setStep] = useState('initial'); // 'initial', 'edit', 'cancel'
    const [editId, setEditId] = useState('');
    const [formData, setFormData] = useState(null);
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

    const handleCancel = async (e) => {
        e.preventDefault();
        if (!formData.cancellationReason) {
            setError('Please provide a cancellation reason');
            return;
        }

        try {
            const response = await api.post('/form/cancelEvent', {
                editId: editId,
                cancellationReason: formData.cancellationReason
            });

            if (response.status === 200) {
                setSuccess('Event cancelled successfully. Notification email has been sent.');
                setTimeout(() => window.location.href = '/', 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to cancel event');
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

    // Initial selection screen
    if (step === 'initial') {
        return (
            <div className="edit-event-container">
                <h2>Edit Event</h2>
                <div className="button-group">
                    <button onClick={() => setStep('edit')} className="edit-button">
                        Edit Event Details
                    </button>
                    <button onClick={() => setStep('cancel')} className="cancel-button">
                        Cancel Event
                    </button>
                </div>
            </div>
        );
    }

    // ID verification screen
    if (!formData) {
        return (
            <div className="edit-event-container">
                <h2>{step === 'cancel' ? 'Cancel Event' : 'Edit Event'}</h2>
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
            </div>
        );
    }

    // Cancel event form
    if (step === 'cancel') {
        return (
            <div className="edit-event-container">
                <h2>Cancel Event</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <form onSubmit={handleCancel} className="cancel-form">
                    <div className="form-group">
                        <label>Cancellation Reason:</label>
                        <textarea
                            name="cancellationReason"
                            value={formData.cancellationReason || ''}
                            onChange={handleInputChange}
                            required
                            rows="4"
                            placeholder="Please provide the reason for cancellation"
                        />
                    </div>
                    <button type="submit" className="cancel-button">
                        Confirm Cancellation
                    </button>
                </form>
            </div>
        );
    }

    // Edit event form
    return (
        <div className="edit-event-container">
            <h2>Edit Event Details</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleEdit} className="edit-form">
                {/* Render form fields based on the event type */}
                {formData.type === 'SCHOOL_TOUR' && (
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

                <button type="submit" className="submit-button">
                    Update Event
                </button>
            </form>
        </div>
    );
};

export default EditEvent;
