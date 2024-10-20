// App.js
import MaintenanceWrapper from './components/MaintenanceWrapper';

function App() {
  return (
    <MaintenanceWrapper isInMaintenance={true}>
      {/* Your entire app goes here */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Other routes */}
        </Routes>
      </Router>
    </MaintenanceWrapper>
  );
}

export default App;
