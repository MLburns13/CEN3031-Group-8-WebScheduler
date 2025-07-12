import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import '../css/shared-styles.css'
import '../css/verify-email.css'

function VerifyEmail() {
  const { token } = useParams()
  const [message, setMessage] = useState('Verifying...')

  useEffect(() => {
    axios.get(`http://localhost:5000/verify-email/${token}`)
      .then(() => setMessage('Email verified! You can now log in.'))
      .catch(() => setMessage('Invalid or expired verification link.'))
  }, [token])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{message}</h2>
    </div>
  )
}

export default VerifyEmail
