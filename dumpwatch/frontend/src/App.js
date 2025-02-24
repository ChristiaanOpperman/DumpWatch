import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/MemberHome';
import OrgHome from './pages/OrgHome';
import CommunityPage from './pages/CommunityPage';
import ViewReportPage from './pages/ViewReportPage';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import SettingsPage from './pages/SettingsPage';


function App() {
  const userType = localStorage.getItem('userType');
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                {userType === 'Community Member' ? <Home /> : <OrgHome />}
              </PrivateRoute>
            }
          />
          <Route
            path="/org"
            element={
              <PrivateRoute>
                <OrgHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/community"
            element={
              <PrivateRoute>
                <CommunityPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/community/:reportId"
            element={
              <PrivateRoute>
                <ViewReportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/knowledge-base"
            element={
              <PrivateRoute>
                <KnowledgeBasePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
  );
}

export default App;
