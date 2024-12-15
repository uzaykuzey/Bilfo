import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeLayout from './home';
import LoginForm from './login';
import UserHomeLayout from './userHome';
import UserSettingsLayout from './userSettings';
import SchoolToursLayout from './school_tours';
import IndividualToursLayout from './individual_tours';
import FairApplicationLayout from './fair_application';
import GuideListLayout from './guide_list';
import TourListLayout from './tour_fair_list';
import AdvisorListLayout from './advisor_list';

function  App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/school_tours" element={<SchoolToursLayout/>} />
        <Route path="/individual_tours" element={<IndividualToursLayout/>} />
        <Route path="/fair_application" element={<FairApplicationLayout/>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/userHome/:bilkentId" element={<UserHomeLayout/>} />
        <Route path="/userHome/:bilkentId/settings" element={<UserSettingsLayout/>} />
        <Route path="/userHome/:bilkentId/guide_list" element={<GuideListLayout/>} />
        <Route path="/userHome/:bilkentId/advisor_list" element={<AdvisorListLayout/>} />
        <Route path="/userHome/:bilkentId/tour_fair_list" element={<TourListLayout/>} />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );

}
export default App;
