import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/shared-styles.css'
import '../css/reset-password.css'

function ResetPassword() {
    const { token } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')

        try {
            await axios.post(`http://localhost:5000/api/reset-password/${token}`, { password, confirmPassword })
            setMessage('Password reset successful! Redirecting to login...')
            setTimeout(() => navigate('/login'), 3000)
        } 
        catch (err) {
            if (err.response?.status === 402) {
                setError('Passwords do not match')
            } else {
                setError('Invalid or expired reset link')
            }
        }
    }

    return (
        <div>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
            <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            />
            <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            />
            <button type="submit">Reset Password</button>
        </form>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}

export default ResetPassword
