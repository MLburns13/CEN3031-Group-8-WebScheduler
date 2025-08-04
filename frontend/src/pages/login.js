import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [error, setError] = useState('')

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
      marginBottom: '32px',
      color: '#ffffff',
      fontSize: '28px',
      fontWeight: '600',
      letterSpacing: '-0.5px'
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
    secondaryButton: {
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
    secondaryButtonHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.2)'
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
    },
    link: {
      textDecoration: 'underline',
      color: '#6366f1'
    }
  }

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user', { withCredentials: true })
        if (res.status === 200) {
          navigate('/')
        }
      }
      catch(err) {}
    }

    checkIfLoggedIn()
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post('http://localhost:5000/login',
        { email, password },
        { withCredentials: true }
      )

      if (res.status === 200) {
        navigate('/')
      }
    } 
    catch (err) {
      console.error(err)
      setError('Login failed. Check your credentials.')
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Welcome Back</h2>

        <input
          type="email"
          placeholder="Email address"
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

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={styles.input}
          onFocus={(e) => {
            Object.assign(e.target.style, styles.inputFocus)
          }}
          onBlur={(e) => {
            Object.assign(e.target.style, styles.input)
          }}
        />

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
          Sign In
        </button>

        <button
          type="button"
          onClick={() => navigate('/signup')}
          style={styles.secondaryButton}
          onMouseEnter={(e) => {
            Object.assign(e.target.style, { ...styles.secondaryButton, ...styles.secondaryButtonHover })
          }}
          onMouseLeave={(e) => {
            Object.assign(e.target.style, styles.secondaryButton)
          }}
        >
          Don't have an account? <span style={styles.link}>Sign Up</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          style={styles.secondaryButton}
          onMouseEnter={(e) => {
            Object.assign(e.target.style, { ...styles.secondaryButton, ...styles.secondaryButtonHover })
          }}
          onMouseLeave={(e) => {
            Object.assign(e.target.style, styles.secondaryButton)
          }}
        >
          Forgot Password?
        </button>
      </form>
    </div>
  )
}

export default Login
