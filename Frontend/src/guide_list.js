import "./guide_list.css"
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function GuideListLayout() {
    const { bilkentId } = useParams();
    const {state} = useLocation();
    const { statusUser } = state;

    const goToGuideList = (e) => {
        e.preventDefault(); // Prevent the default anchor behavior
        navigate(`/userHome/${bilkentId}/guide_list`, { state: { statusUser } });
      };
    return(
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
          <a href="/profile" className="nav-link">Profile</a>
          <a href="/tours-fairs" className="nav-link">Tours and Fairs</a>
          
          {/* Conditionally render Guide List link for Advisors */}
          {statusUser == "ADVISOR" && (
            <a className="nav-link" onClick={goToGuideList}>Guide List</a>
          )}

          <a href="/puantaj" className="nav-link">Puantaj Table</a>
          <a href="/logout" className="nav-link">Log Out</a>
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
      </div>
    );
}