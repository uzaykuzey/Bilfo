import "./individual_tours.css";

export default function IndividualToursLayout() {
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
          <a href="/" className="nav-link">
            Campus Tours
          </a>
          <a href="/fair-application" className="nav-link">
            Fair Application
          </a>
          <a href="/login" className="nav-link">
            Log In
          </a>
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

      {/* Form Section */}
      <main className="form-container">
        <div className="form-wrapper">
          <h2>Submit Individual Tour Application</h2>
          <form className="tour-form">
            <div className="form-group">
              <label htmlFor="names">Names of Applicants:</label>
              <input
                type="text"
                id="names"
                placeholder="Name 1, Name 2, Name 3"
                required
              />
            </div>

            <div className="form-group">
              <label>First time preference:</label>
              <div className="time-selection">
                <input type="date" required />
                <select>
                  <option>9.00</option>
                  <option>11.00</option>
                  <option>13.30</option>
                  <option>16.00</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Second time preference:</label>
              <div className="time-selection">
                <input type="date" required />
                <select>
                  <option>9.00</option>
                  <option>11.00</option>
                  <option>13.30</option>
                  <option>16.00</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Third time preference:</label>
              <div className="time-selection">
                <input type="date" required />
                <select>
                <option>9.00</option>
                  <option>11.00</option>
                  <option>13.30</option>
                  <option>16.00</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="visitors">Number of visitors:</label>
              <input type="number" id="visitors" min="1" required />
            </div>

            <div className="form-group">
              <label htmlFor="major">Major of Interest:</label>
              <select id="major" required>
                <option value="CS">CS</option>
                <option value="EE">EE</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email">Contact Email:</label>
              <input
                type="email"
                id="email"
                placeholder="examplecontactemail@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Visitor notes:</label>
              <textarea
                id="notes"
                placeholder="I am really curious about UNAM, please consider this :)"
              ></textarea>
            </div>

            <div className="form-group checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I have read and accepted the{" "}
                <a href="/terms-and-conditions">Terms & Conditions</a>
              </label>
            </div>

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
