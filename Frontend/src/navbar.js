import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./navbar.css"

export default function NavbarLayout(){
  const { bilkentId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { statusUser } = state;
  const goToGuideList = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/guide_list`, { state: { statusUser } });
  };
  const goToAdvisorlist = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/advisor_list`, { state: { statusUser } });
  };
  const goToTourFairList = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/tour_fair_list`, { state: { statusUser } });
  };
  const goToUserHome = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}`, { state: { statusUser } })
  }
  const goToPuantajTable = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/puantaj`, { state: { statusUser } })
  }
  const goToPuantajTableGuide = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/puantaj_guide`, { state: { statusUser } });
  } 
return(
<nav className="sidebar" >
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
          <a className="nav-link" onClick={goToUserHome}>Profile</a>
          <a className="nav-link" onClick={goToTourFairList}>Tours and Fairs</a>

          {statusUser === "COORDINATOR" || statusUser === "ADVISOR" && (
            <a className="nav-link" onClick={goToAdvisorlist}>Advisor List</a>
          )}

          {statusUser === "ADVISOR" && (
            <a className="nav-link" onClick={goToGuideList}>Guide List</a>
          )}
          {statusUser === "GUIDE" &&(
            <a href="/puantaj" className="nav-link" onClick={goToPuantajTable}>Puantaj Table</a>
          )}
          {statusUser === "ADVISOR" &&(
            <a href="/puantaj" className="nav-link" onClick={goToPuantajTableGuide}>Puantaj Table</a>
          )}
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
);
}