// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MaintenanceWrapper from './components/MaintenanceWrapper';

// Create a simple Home component (you can move this to a separate file later)
const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};

function App() {
  return (
    <MaintenanceWrapper isInMaintenance={true}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </MaintenanceWrapper>
  );
}

export default App;
