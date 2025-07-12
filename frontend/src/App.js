import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Signup from './pages/signup'
import VerifyEmail from './pages/verifyEmail'
import ForgotPassword from './pages/forgotPassword'
import ResetPassword from './pages/resetPassword'
import Home from './pages/homepage'
import Profile from './pages/profile'
import ProfileEditor from './pages/profileEditor'
import FocusTimerPage from './pages/focusTimer';

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(res => setMessage(res.data))
      .catch(err => console.error('Error fetching message:', err))
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-profile" element={<ProfileEditor />} />
        <Route path="/focusTimer" element={<FocusTimerPage />} />
      </Routes>
    </Router>
  )
}

export default App
