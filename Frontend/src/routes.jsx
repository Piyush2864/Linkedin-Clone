import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import AppliedJobs from './pages/AppliedJobs';
import SavedJobs from './pages/SavedJobs';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/applied-jobs" element={<AppliedJobs />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
