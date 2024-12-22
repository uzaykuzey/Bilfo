import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import "./navbar.css"
import { useAuth } from "./AuthContext";

export default function NavbarLayout(){
  const { bilkentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const statusUser = location.state?.statusUser || user?.role || 'GUIDE';

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

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/', { replace: true });
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    navigate(`/userHome/${bilkentId}/dashboard`, { state: { statusUser}});
  };

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

          {(statusUser === "COORDINATOR" || statusUser === "ACTING DIRECTOR" || statusUser === "ADMIN") && (
            <a className="nav-link" onClick={goToAdvisorlist}>Advisor List</a>
          )}

          {(statusUser === "ADVISOR" || statusUser === "COORDINATOR" || statusUser === "ACTING DIRECTOR" || statusUser === "ADMIN") && (
            <a className="nav-link" onClick={goToGuideList}>Guide List</a>
          )}

          {(statusUser === "ADVISOR" || statusUser === "GUIDE") && (
            <a className="nav-link" onClick={goToPuantajTable}>Puantaj Table</a>
          )}
          

          {(statusUser === "COORDINATOR" || statusUser === "ACTING DIRECTOR" || statusUser === "ADMIN") && (
            <a className="nav-link" onClick={goToPuantajTableGuide}>Puantaj Table: Guides</a>
          )}
          
          {(statusUser === "COORDINATOR" || statusUser === "ACTING DIRECTOR" || statusUser === "ADMIN") && (
            <a className="nav-link" onClick={handleDashboardClick}>Dashboard</a>
          )}

          
          <a className="nav-link" id = "logout" onClick={handleLogout}>Log Out</a>
          

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