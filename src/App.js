// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MaintenanceWrapper from './components/MaintenanceWrapper';

function App() {
  return (
    <Router>
      <MaintenanceWrapper isInMaintenance={true}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          {/* Other routes */}
        </Routes>
      </MaintenanceWrapper>
    </Router>
  );
}

export default App;
