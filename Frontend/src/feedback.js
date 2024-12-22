import React, { useState } from "react";
import api from "./api/axios_config";
import "./feedback.css";

export default function FeedbackLayout() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [experience, setExperience] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [password, setPassword] = useState("");
  const [contactMail, setContactMail] = useState(""); // Added state for contactMail
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if all fields are filled
    if (
      rating === 0 ||
      experience.trim() === "" ||
      password.trim() === "" ||
      contactMail.trim() === ""
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    setError(""); // Clear any previous error messages

    // Data to send
    const feedbackData = {
      rating,
      experience,
      recommendation,
      password,
      contactMail, // Use the email provided by the user
    };

    try {
      const response = await api.post("/event/feedback", feedbackData);
      console.log("Feedback submitted successfully:", response.data);

      // Clear form fields on success
      setRating(0);
      setHover(0);
      setExperience("");
      setRecommendation("");
      setPassword("");
      setContactMail("");
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="feedback-page">
      {/* Navbar */}
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
          <a href="/edit_event" className="nav-link">Edit Event</a>
          <a href="/feedback" className="nav-link">Feedback</a>
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

      {/* Feedback Form */}
      <form className="feedback-form" onSubmit={handleSubmit}>
        <h2 className="form-title">📝 Feedback Form</h2>

        {/* Star Rating */}
        <div className="rating-container">
          <label className="label">Rate the Tour:</label>
          <div className="stars">
            {[...Array(10)].map((_, index) => {
              index += 1;
              return (
                <span
                  key={index}
                  className={index <= (hover || rating) ? "star selected" : "star"}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                >
                  ★
                </span>
              );
            })}
          </div>
        </div>

        {/* Textarea for Experiences */}
        <div className="form-group1">
          <label>Please tell us about your experiences:</label>
          <textarea
            rows="4"
            placeholder="Share your experiences..."
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>

        {/* Textarea for Recommendations */}
        <div className="form-group1">
          <label>Any Recommendations?</label>
          <textarea
            rows="4"
            placeholder="Share your recommendations..."
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
          />
        </div>

        {/* Input for Contact Email */}
        <div className="form-group2">
          <label>Enter Your Email:</label>
          <input
            type="email"
            placeholder="e.g., yourname@example.com"
            className="input-code"
            value={contactMail}
            onChange={(e) => setContactMail(e.target.value)}
          />
        </div>

        {/* Input for Email Code */}
        <div className="form-group2">
          <label>Enter the Code From Your Email:</label>
          <input
            type="text"
            placeholder="e.g., 12345"
            className="input-code"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>



        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
