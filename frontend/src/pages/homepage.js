import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/user', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => navigate('/login'));
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={() => {
        axios.delete('http://localhost:5000/logout', { withCredentials: true })
          .then(() => navigate('/login'));
      }}>
        Logout
      </button>
    </div>
  );
}

export default Home;
