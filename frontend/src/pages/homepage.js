import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../homepage.css';

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/user', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleLogout = () => {
    axios.delete('http://localhost:5000/logout', { withCredentials: true })
      .then(() => navigate('/login'));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="homeContainer">
      <header className="welcomeBanner">
        <h1>Welcome, {user.name}!</h1>
        <p>Welcome to the WebScheduler — your productivity journey starts now.</p>
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboardGrid">
        <div className="dashboardBox">
          <h2>Your Productivity Summary</h2>
          <p>Stats and progress.</p>
        </div>

        <div className="dashboardBox">
          <h2>Popular Tools</h2>
          <ul>
            <li>Focus Timer</li>
            <li>Hydration Reminder</li>
            <li>Stretch Breaks</li>
          </ul>
        </div>

        <div className="dashboardBox leaderboardCard">
          <h2>Leaderboard</h2>
          <p>Compare your productivity with top users this week.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
