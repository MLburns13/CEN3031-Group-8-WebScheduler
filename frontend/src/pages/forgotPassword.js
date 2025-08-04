import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    // Modern dark theme styles
    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            padding: '20px',
            boxSizing: 'border-box'
        },
        form: {
            backgroundColor: '#1e1e2e',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            width: '100%',
            maxWidth: '420px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
        },
        title: {
            textAlign: 'center',
            marginBottom: '16px',
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: '600',
            letterSpacing: '-0.5px'
        },
        subtitle: {
            textAlign: 'center',
            marginBottom: '32px',
            color: '#a5a5b8',
            fontSize: '14px',
            lineHeight: '1.5'
        },
        input: {
            display: 'block',
            width: '100%',
            padding: '16px 20px',
            marginBottom: '20px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            fontSize: '16px',
            backgroundColor: '#2a2a3e',
            color: '#ffffff',
            boxSizing: 'border-box',
            transition: 'all 0.3s ease',
            outline: 'none'
        },
        inputFocus: {
            borderColor: '#6366f1',
            backgroundColor: '#323244',
            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
        },
        button: {
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '12px'
        },
        buttonHover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
        },
        backButton: {
            width: '100%',
            padding: '14px',
            backgroundColor: 'transparent',
            color: '#a5a5b8',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginTop: '12px'
        },
        backButtonHover: {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        successMessage: {
            color: '#10b981',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'center',
            padding: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '8px'
        },
        errorMessage: {
            color: '#ef4444',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'center',
            padding: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px'
        }
    }

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
        <div style={styles.container}>
            <div style={styles.form}>
                <h2 style={styles.title}>Forgot Password?</h2>
                <p style={styles.subtitle}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={styles.input}
                        onFocus={(e) => {
                            Object.assign(e.target.style, styles.inputFocus)
                        }}
                        onBlur={(e) => {
                            Object.assign(e.target.style, styles.input)
                        }}
                    />
                    
                    {message && <div style={styles.successMessage}>{message}</div>}
                    {error && <div style={styles.errorMessage}>{error}</div>}
                    
                    <button 
                        type="submit"
                        style={styles.button}
                        onMouseEnter={(e) => {
                            Object.assign(e.target.style, { ...styles.button, ...styles.buttonHover })
                        }}
                        onMouseLeave={(e) => {
                            Object.assign(e.target.style, { ...styles.button, transform: 'none', boxShadow: styles.button.boxShadow || 'none' })
                        }}
                    >
                        Send Reset Link
                    </button>
                </form>

                <button
                    onClick={handleBack}
                    style={styles.backButton}
                    onMouseEnter={(e) => {
                        Object.assign(e.target.style, { ...styles.backButton, ...styles.backButtonHover })
                    }}
                    onMouseLeave={(e) => {
                        Object.assign(e.target.style, styles.backButton)
                    }}
                >
                    Back to Login
                </button>
            </div>
        </div>
    )
}

export default ForgotPassword
