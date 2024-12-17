import React, { useState } from "react";
import "./feedback.css";

export default function FeedbackLayout() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

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

      {/* Feedback Form */}
      <div className="feedback-form">
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
        <div className="form-group">
          <label>Please tell us about your experiences:</label>
          <textarea rows="4" placeholder="Share your experiences..." />
        </div>

        {/* Textarea for Recommendations */}
        <div className="form-group">
          <label>Any Recommendations?</label>
          <textarea rows="4" placeholder="Share your recommendations..." />
        </div>

        {/* Input for Email Code */}
        <div className="form-group">
          <label>Enter the Code From Your Email:</label>
          <input type="text" placeholder="e.g., 12345" className="input-code" />
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <button className="submit-button">Submit</button>
        </div>
      </div>
    </div>
  );
}
