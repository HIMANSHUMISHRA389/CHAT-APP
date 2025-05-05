import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import './App.css'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react"
function App() {
  const{authUser,checkAuth,isCheckingAuth}=useAuthStore()

  useEffect(()=>{
    checkAuth();
  },[authUser])

  console.log({authUser})

  if(isCheckingAuth && !authUser) 
    return (
  <div className='flex items-center justify-center h-screen'>
    <Loader/>
  </div>)
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={authUser?<HomePage />:<Navigate to="/login"/> } />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
