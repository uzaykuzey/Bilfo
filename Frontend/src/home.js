import "./home.css";

export default function HomeLayout() {
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
          <a href="/campus-tours" className="nav-link">Campus Tours</a>
          <a href="/fair-application" className="nav-link">Fair Application</a>
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
      <main className="main-content">
        <h1 className="page-title">Campus Tours</h1>

        {/* Tour Application Buttons */}
        <div className="tour-links">
          <a href="/school-tour" className="tour-link">School Tour Application</a>
          <a href="/individual-tour" className="tour-link">Individual Tour Application</a>
        </div>

        {/* Content Description */}
        <div className="content-description">
          <p>
            During your campus visit, you will have the opportunity to receive information about
            the university's academic programs from our guide students, and you will be able to
            experience the beauty and facilities of the campus firsthand.
          </p>

          {/* Visit Expectations */}
          <div className="visit-expectations">
            <h2>What to Expect During Your Campus Visit:</h2>
            <p>
              Your campus visit will start at the promotion area in front of the Faculty of Economics,
              Administrative and Social Sciences. Guide students will greet you there. You will be
              able to ask questions about your target departments, and you will also have the
              chance to learn about other academic programs that may align with your interests. An
              important feature of these visits is the opportunity to gain insight into the university's
              facilities beyond academics. If you would like to tour the campus, guide students will
              accompany you. The campus tour will start from the student dormitories, continue with
              the sports center in the dormitory area, and then proceed to faculty buildings and
              other key areas of the campus, finishing at the library.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
