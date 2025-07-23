import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';

// Import Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* This is the main feed. It's protected, so only logged-in users can see it. */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        {/* The login page is a guest route. Logged-in users will be redirected away from it. */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        {/* The register page is also a guest route. */}
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
