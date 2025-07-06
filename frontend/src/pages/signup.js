import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/shared-styles.css';
import '../css/login-signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [display_name, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user', { withCredentials: true });
        if (res.status === 200) {
          navigate('/');
        }
      }
      catch(err) {}
    };

    checkIfLoggedIn();
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/signup', { email, password, display_name, username });
      alert('Signup successful!');
      navigate('/login');
    } 
    catch (err) {
      console.error(err);
      setError('Signup failed.');
    }
  };

  return (
    <div className="loginContainer">
      <form onSubmit={handleSignup} className="loginForm">
        <h2>Sign Up</h2>

        <input
          type="username"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          type="display-name"
          placeholder="Display Name"
          value={display_name}
          onChange={e => setDisplayName(e.target.value)}
          required
        />

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

        <button type="submit">Create Account</button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="signupButton"
        >
          Already have an account? <u>Log In</u>
        </button>
      </form>
    </div>
  );
}

export default Signup;
