import './App.css';
import api from "./api/axios_config"
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeLayout from './home';
import LoginForm from './login';
import UserHomeLayout from './userHome';
import UserSettingsLayout from './userSettings';

function  App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/userHome/:bilkentId" element={<UserHomeLayout/>} />
        <Route path="/userHome/:bilkentId/settings" element={<UserSettingsLayout/>} />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );

}
export default App;