import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from './AuthContext';

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
import AvailabilityLayout from './availability';
import ScheduleLayout from './tour_schedule';
import FeedbackLayout from './feedback';
import PuantajLayout from './puantaj_table';
import ForgotPasswordLayout from './forgot_password';
import PuantajTableGuideLayout from './puantaj_table_guide';
import DashboardLayout from './dashboard';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Routes>
        {/*Public Routes*/}
        <Route path="/" element={<HomeLayout />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/school_tours" element={<SchoolToursLayout />} />
        <Route path="/individual_tours" element={<IndividualToursLayout/>} />
        <Route path="/fair_application" element={<FairApplicationLayout/>} />
        <Route path="/feedback" element={<FeedbackLayout/>} />
        <Route path="/forgot_password" element={<ForgotPasswordLayout/>} />
        <Route path="/dashboard" element={<DashboardLayout />} />

        {/* Protected routes */}
       <Route
         path="/userHome/:bilkentId"
         element={
           <ProtectedRoute allowedRoles={['GUIDE', 'ADVISOR', 'COORDINATOR', 'ACTING_DIRECTOR', 'ADMIN']}>
             <UserHomeLayout />
           </ProtectedRoute>
         }
       />

        <Route
         path="/userHome/:bilkentId/settings"
         element={
           <ProtectedRoute allowedRoles={['GUIDE', 'ADVISOR', 'COORDINATOR', 'ACTING_DIRECTOR', 'ADMIN']}>
             <UserSettingsLayout />
           </ProtectedRoute>
         }
       />

        <Route
         path="/userHome/:bilkentId/guide_list"
         element={
           <ProtectedRoute allowedRoles={['ADVISOR', 'COORDINATOR', 'ACTING_DIRECTOR', 'ADMIN']}>
             <GuideListLayout/>
           </ProtectedRoute>
         }
       />

        <Route
         path="/userHome/:bilkentId/advisor_list"
         element={
           <ProtectedRoute allowedRoles={['COORDINATOR', 'ACTING_DIRECTOR', 'ADMIN']}>
             <AdvisorListLayout />
           </ProtectedRoute>
         }
       />

        <Route
         path="/userHome/:bilkentId/tour_fair_list"
         element={
           <ProtectedRoute allowedRoles={['GUIDE', 'ADVISOR', 'COORDINATOR', 'ACTING_DIRECTOR', 'ADMIN']}>
             <TourListLayout />
           </ProtectedRoute>
         }
       />

        <Route
         path="/userHome/:bilkentId/availability"
         element={
           <ProtectedRoute allowedRoles={['GUIDE', 'ADVISOR', 'COORDINATOR', 'ACTING_DIRECTOR', 'ADMIN']}>
             <AvailabilityLayout />
           </ProtectedRoute>
         }
       />

        <Route
         path="/userHome/:bilkentId/schedule"
         element={
           <ProtectedRoute allowedRoles={['GUIDE', 'ADVISOR', 'COORDINATOR', 'ACTING_DIRECTOR', 'ADMIN']}>
             <ScheduleLayout />
           </ProtectedRoute>
         }
       />

        <Route
         path="/userHome/:bilkentId/puantaj"
         element={
           <ProtectedRoute allowedRoles={['GUIDE', 'ADVISOR', 'COORDINATOR', 'ACTING_DIRECTOR', 'ADMIN']}>
             <PuantajLayout />
           </ProtectedRoute>
         }
       />

        <Route
         path="/userHome/:bilkentId/puantaj_guide"
         element={
           <ProtectedRoute allowedRoles={['GUIDE','ADVISOR', 'COORDINATOR', 'ACTING_DIRECTOR', 'ADMIN']}>
             <PuantajTableGuideLayout />
           </ProtectedRoute>
         }
       />

        <Route
         path="/userHome/:bilkentId/dashboard"
         element={
           <ProtectedRoute allowedRoles={['GUIDE', 'ADVISOR', 'COORDINATOR', 'ACTING_DIRECTOR', 'ADMIN']}>
             <DashboardLayout />
           </ProtectedRoute>
         }
       />


        {/* Catch-all route */}
        <Route path="*" element={
          user ? (
            <Navigate to={`/userHome/${user.sub}`} replace state={{ statusUser: user.role }} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
      </Routes>
    </div>
  );

}
export default App;
