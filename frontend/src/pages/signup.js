import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../login.css'; // Reuse the same CSS

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/signup', { email, password, name });
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
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
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
