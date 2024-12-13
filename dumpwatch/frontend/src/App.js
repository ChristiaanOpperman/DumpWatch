import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CommunityPage from './pages/CommunityPage';
import ViewReportPage from './pages/ViewReportPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:reportId" element={<ViewReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
