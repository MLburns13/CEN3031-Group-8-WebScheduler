import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import '../css/shared-styles.css'
import '../css/profile.css'

function Home() {
  const [user, setUser] = useState(null)
  const [viewingUser, setViewingUser] = useState(null)
  const [recentTimers, setRecentTimers] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()
  var ownProfile = false

  useEffect(() => {
    axios.get('http://localhost:5000/api/user', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => navigate('/login'))
  }, [navigate])

  useEffect(() => {
    axios.get(`http://localhost:5000/profile/${id}`, { withCredentials: true })
      .then(res => {
        setViewingUser(res.data.viewingUser)
      })
      .catch(err => {
        console.error("Error fetching profile:", err)
        if (err.response?.status === 401) navigate('/login')
      })
  }, [id, navigate])

  useEffect(() => {
    if (!id) return
    axios.get(`http://localhost:5000/api/user/${id}/recent-timers`, { withCredentials: true })
      .then(res => setRecentTimers(res.data))
      .catch(err => {
        console.error("Error fetching recent timers:", err)
        setRecentTimers([])
      })
  }, [id])

  const handleEdit = () => {
    navigate('/edit-profile')
  }

  const handleBack = () => {
    navigate('/')
  }

  if (!user) return <p>Loading...</p>
  if (!viewingUser) return <p>Loading profile...</p>

  if(user._id === viewingUser._id) {
    ownProfile = true
  }

  return (
    <div className="homeContainer">
      <header className="welcomeBanner">
        <h1>Welcome to {viewingUser.display_name}'s Profile!</h1>
        <p>Profile Screen</p>
        <div className="accountDropdown">
          <button className="accountDropdownButton" onClick={handleBack}>
            Back
          </button> 
        </div>
        {ownProfile && (
          <button className="editProfileButton" onClick={handleEdit}>
            Edit Profile
          </button>
        )}
      </header>

      <div className="dashboardBox" style={{ maxWidth: 400, marginBottom: 32 }}>
        <h2>Recent Timers</h2>
        {recentTimers.length === 0 ? (
          <p>No recent timers found.</p>
        ) : (
          <ul className="nonIndentedList">
            {recentTimers.map((timer, idx) => (
              <li key={timer._id} style={{ marginBottom: 8 }}>
                <strong>{timer.type === 'focus' ? 'Focus' : 'Popup'} Timer</strong>
                {timer.type === 'focus' ? (
                  <>
                    : {timer.focusTime} min focus, {timer.breakTime} min break, {timer.longBreakTime} min long break
                  </>
                ) : (
                  <>
                    : {timer.popupName} ({timer.popupCount} times)
                  </>
                )}
                <div>
                  {new Date(timer.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Home