import React from 'react';
import { useAppSelector } from './redux/hooks';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useSocket from './hooks/useSocket';
import NotificationList from './components/NotificationList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

const App = () => {
  const { user } = useAppSelector((state) => state.auth);

  useSocket(user?.id); // Connect to WebSocket for real-time notifications

  return (
    <Router>
      <div className="App">
        {user && <NotificationList userId={user?.id} />} {/* Display notifications if user is logged in */}

        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
