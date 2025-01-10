import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CommunityPage from './pages/CommunityPage';
import ViewReportPage from './pages/ViewReportPage';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:reportId" element={<ViewReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
