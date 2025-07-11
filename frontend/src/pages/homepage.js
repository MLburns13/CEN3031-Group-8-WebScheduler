import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/shared-styles.css'
import '../css/homepage.css'
import PopupTimer from '../components/popupTimer'

function Home() {
  const [user, setUser] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchError, setSearchError] = useState(null)
  const navigate = useNavigate()


  useEffect(() => {
    axios.get('http://localhost:5000/api/user', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => navigate('/login'))
  }, [navigate])

  const handleLogout = () => {
    axios.delete('http://localhost:5000/logout', { withCredentials: true })
      .then(() => navigate('/login'))
  }

  const handleProfile = () => {
    navigate(`/profile/${user._id}`)
  }

  const handleUserSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/search-user?username=${searchInput}`, { withCredentials: true })

      if (res.data && res.data._id) {
        navigate(`/profile/${res.data._id}`)
      } else {
        setSearchError('User not found')
      }
    } catch (err) {
      console.error(err)
      setSearchError('Some error occured')
    }
  }

  if (!user) return <p>Loading...</p>

  console.log(user) //Temporary for data validation. Delete later

  return (
    <div className="homeContainer">
      <header className="welcomeBanner">
        <h1>Welcome, {user.display_name}!</h1>
        <p>Welcome to the WebScheduler — your productivity journey starts now.</p>
        <div className="accountDropdown">
          <button className="accountDropdownButton">{user.username}</button>
          <div className="accountDropdownContent">
            <button onClick={handleProfile}>Profile</button>  {/* Temporary, replace with profile handler*/}
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="searchBarContainer">
        <input
          type="text"
          placeholder="User Search {Username}"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleUserSearch()
            }
          }}
        />
        <button onClick={handleUserSearch}>Search</button>
        {searchError && <p className="errorText">{searchError}</p>}
      </div>

      <div className="dashboardGrid">
        <div className="dashboardBox">
          <h2>Your Productivity Summary</h2>
          <p>Stats and progress.</p>
        </div>

        <div className="dashboardBox">
          <h2>Popular Tools</h2>
          <ul>
            <PopupTimer
              name="Hydration"
              popUpMessage="Time for hydration!!!!!!!!!!!!!"
              initialMinutes={15}
            />

            <PopupTimer
              name="Stretch"
              popUpMessage="Stretch it out!!!!!!!!!!!!!!!!!!!!!"
              initialMinutes={30}
            />

            <PopupTimer
              name="Stand Up"
              initialMinutes={60}
              popUpMessage="Stand Up!!!!!!!!!!!!!!!!!!!!!!!!!"
            />
          </ul>
        </div>

        <div className="dashboardBox leaderboardCard">
          <h2>Leaderboard</h2>
          <p>Compare your productivity with top users this week.</p>
          <button>Add Friends</button>
        </div>
      </div>
    </div>
  )
}

export default Home
