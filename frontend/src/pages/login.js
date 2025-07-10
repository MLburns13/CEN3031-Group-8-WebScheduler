import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/shared-styles.css'
import '../css/login-signup.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [error, setError] = useState('')

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
    <div className="loginContainer">
      <form onSubmit={handleLogin} className="loginForm">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && <p className="errorMessage">{error}</p>}

        <button type="submit">Login</button>

        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="signupButton"
        >
          Don't have an account? <u>Sign Up</u>
        </button>
      </form>
    </div>
  )
}

export default Login
