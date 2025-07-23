import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/shared-styles.css'
import '../css/forgot-password.css'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')

        try {
        await axios.post('http://localhost:5000/api/request-password-reset', { email })
        setMessage('If your email is registered, a reset link has been sent.')
        } catch (err) {
        setError('Something went wrong. Please try again.')
        }
    }

    const handleBack = () => {
        navigate('/login')
  }

    return (
        <div className="homeContainer">
            <header className="welcomeBanner">
                <h2>Forgot Password</h2>
                <div className="accountDropdown">
                    <button className="accountDropdownButton" onClick={handleBack}>
                        Back
                    </button> 
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    />
                    <button type="submit">Send Reset Link</button>
                </form>

                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </header>
        </div>
    )
}

export default ForgotPassword
