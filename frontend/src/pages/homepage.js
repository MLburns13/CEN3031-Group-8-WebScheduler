import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/shared-styles.css'
import '../css/homepage.css'
import PopupTimer from '../components/popupTimer'
import FriendsList from '../components/friendsList'
import Leaderboard from '../components/leaderboard'

function Home() {
  const [user, setUser] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchError, setSearchError] = useState(null)
  const navigate = useNavigate()
  const [allUsers, setAllUsers] = useState([])
  const [allTimers, setAllTimers] = useState([])

  useEffect(() => {
    const init = async () => {
      try {
        // 1️⃣ Confirm auth
        const { data: me } = await axios.get('http://localhost:5000/api/user', {
          withCredentials: true,
          validateStatus: status => status < 500
        })
        if (!me || me._id == null) {
          // not logged in → go to login
          return navigate('/login')
        }
        setUser(me)

        // 2️⃣ Now that we know we’re authed, fetch leaderboard
        const { data: timers } = await axios.get('http://localhost:5000/api/timers', {
          withCredentials: true
        })
        setAllTimers(timers)

        // 3️⃣ And friends list
        const { data: users } = await axios.get('http://localhost:5000/api/friends/all-users', {
          withCredentials: true
        })
        setAllUsers(users)

      } catch (err) {
        console.error('Unexpected error in init:', err)
        // optionally navigate('/login') here
      }
    }

    init()
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

  return (
    <div className="homeContainer">
      <header className="welcomeBanner">
        <h1>Welcome, {user.display_name}!</h1>
        <p>Welcome to the WebScheduler — your productivity journey starts now.</p>
        <div className="accountDropdown">
          <button className="accountDropdownButton">{user.username}</button>
          <div className="accountDropdownContent">
            <button onClick={handleProfile}>Profile</button>
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
              initialMinutes={user.settings?.hydrationInterval || 15}
              popUpMessage={user.customMessages?.hydration || 'Time for hydration!'}
            />

            <PopupTimer
              name="Stretch"
              initialMinutes={user.settings?.stretchInterval || 30}
              popUpMessage={user.customMessages?.stretch || 'Time to stretch!'}
            />

            <PopupTimer
              name="Stand"
              initialMinutes={user.settings?.standInterval || 60}
              popUpMessage={user.customMessages?.stand || 'Time to stand up!'}
            />
          </ul>

          <button
            onClick={() => navigate('/focusTimer')}
            className="timerButton"
            style={{ marginTop: '16px', width: '100%' }}
          >
            Focus Timer
          </button>

        </div>

        <div className="dashboardBox leaderboardCard">
          <Leaderboard leaderboardData={allTimers} />
        </div>
      </div>

      <FriendsList user={user} allUsers={allUsers} refreshUser={() => {
        axios.get('http://localhost:5000/api/user', { withCredentials: true })
          .then(res => setUser(res.data))
      }} />
    </div>
  )
}

export default Home
