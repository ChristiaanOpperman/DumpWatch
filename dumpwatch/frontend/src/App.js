import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CommunityPage from './pages/CommunityPage';
import ViewReportPage from './pages/ViewReportPage';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import KnowledgeBasePage from './pages/KnowledgeBasePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
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
      </Routes>
    </Router>
  );
}

export default App;
