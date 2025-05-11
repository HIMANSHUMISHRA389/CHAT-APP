import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import './App.css'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from "lucide-react"

// Component to conditionally render the Navbar
function AppContent() {
  const location = useLocation();
  const { authUser, isCheckingAuth } = useAuthStore();
  
  // Pages where Navbar should NOT be shown
  const hideNavbarOn = ['/signup', '/login'];
  const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);
  
  if (isCheckingAuth && !authUser)
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader />
      </div>
    );
    console.log(authUser)
  return (
    <div className="app">
      {shouldShowNavbar && 
      <Navbar />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login"element={authUser ? <HomePage /> : <LoginPage />} />
        <Route
          path="/settings"
          element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        {/* Fallback route for unknown paths */}
        <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} />} />
      </Routes>
    </div>
  );
}

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
