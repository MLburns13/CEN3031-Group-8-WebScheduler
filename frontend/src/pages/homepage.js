import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/shared-styles.css';
import '../css/homepage.css';

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

  console.log(user) //Temporary for data validation. Delete later

  return (
    <div className="homeContainer">
      <header className="welcomeBanner">
        <h1>Welcome, {user.display_name}!</h1>
        <p>Welcome to the WebScheduler — your productivity journey starts now.</p>
        <div className="accountDropdown">
          <button className="accountDropdownButton">{user.username}</button>
          <div className="accountDropdownContent">
            <button onClick={handleLogout}>Profile</button>  {/* Temporary, replace with profile handler*/}
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
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
