import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
const Home = lazy(() => import('./pages/MemberHome'));
const OrgHome = lazy(() => import('./pages/OrgHome'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const ViewReportPage = lazy(() => import('./pages/ViewReportPage'));
const Login = lazy(() => import('./pages/Login'));
const KnowledgeBasePage = lazy(() => import('./pages/KnowledgeBasePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function App() {
  const userType = localStorage.getItem('userType');
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </Router>
  );
}

export default App;
