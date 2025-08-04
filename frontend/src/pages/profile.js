import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import '../css/shared-styles.css'
import '../css/profile.css'

function Home() {
  const [user, setUser] = useState(null)
  const [viewingUser, setViewingUser] = useState(null)
  const [recentTimers, setRecentTimers] = useState([])
  const [customMsgs, setCustomMsgs] = useState({hydration: '', stretch: '', stand: '', focusCompletion: ''})
  const navigate = useNavigate()
  const { id } = useParams()
  var ownProfile = false
  const [timersHidden, setTimersHidden] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:5000/api/user', { withCredentials: true })
      .then(res => {
        setUser(res.data)
        setCustomMsgs({
          hydration: res.data.customMessages?.hydration || 'Time for hydration!',
          stretch: res.data.customMessages?.stretch || 'Stretch it out!',
          stand: res.data.customMessages?.stand || 'Stand Up!',
          focusCompletion: res.data.customMessages?.focusCompletion || 'Good Job!'
        })
      })
      .catch(() => navigate('/login'))
  }, [navigate])

  useEffect(() => {
    axios.get(`http://localhost:5000/profile/${id}`, { withCredentials: true })
      .then(res => {
        setViewingUser(res.data.viewingUser)
        setTimersHidden(!!res.data.viewingUser.settings?.hideRecentTimers)
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

  const handleChange = e => {
    const { name, value } = e.target
    setCustomMsgs(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    const defaults = {
      hydration:       'Time for hydration!',
      stretch:         'Stretch it out!',
      stand:           'Stand Up!',
      focusCompletion: 'Good Job!'
    }

    const newMessages = {
      hydration:       customMsgs.hydration.trim()       === '' ? defaults.hydration       : customMsgs.hydration,
      stretch:         customMsgs.stretch.trim()         === '' ? defaults.stretch         : customMsgs.stretch,
      stand:           customMsgs.stand.trim()           === '' ? defaults.stand           : customMsgs.stand,
      focusCompletion: customMsgs.focusCompletion.trim() === '' ? defaults.focusCompletion : customMsgs.focusCompletion
    }

    try {
      await axios.post(
        'http://localhost:5000/api/user/custom-messages',
        newMessages,
        { withCredentials: true }
      )

      const res = await axios.get('http://localhost:5000/api/user', { withCredentials: true })
      setUser(res.data)
      setViewingUser(res.data)
      alert('Custom messages saved!')
    } catch (err) {
      console.error('Error saving custom messages:', err)
      alert('Failed to save messages')
    }
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

      {user.isAdmin && !ownProfile && (
        <div className="dashboardBox" style={{ maxWidth: 400, marginBottom: 32 }}>
          <h2>Admin Actions</h2>

          <button
            className="deleteButton"
            onClick={async () => {
              if (!window.confirm(`Are you sure you want to delete all sessions for ${viewingUser.display_name}?`)) return;

              try {
                await axios.delete(`http://localhost:5000/api/admin/delete-user-sessions/${viewingUser._id}`, {
                  withCredentials: true
                });
                alert("All timer sessions deleted for this user.");
                setRecentTimers([]);
              } catch (err) {
                console.error("Error deleting user sessions:", err);
                alert("Failed to delete sessions.");
              }
            }}
          >
            Delete All Timer Sessions
          </button>

          {!viewingUser.isAdmin && (
            <button
              className="promoteButton"
              onClick={async () => {
                if (!window.confirm(`Are you sure you want to promote ${viewingUser.display_name} to admin?`)) return;

                try {
                  await axios.put(`http://localhost:5000/api/admin/promote/${viewingUser._id}`, {}, { withCredentials: true });
                  alert(`${viewingUser.display_name} is now an admin!`);

                  // Refresh profile data
                  const res = await axios.get(`http://localhost:5000/profile/${viewingUser._id}`, { withCredentials: true });
                  setViewingUser(res.data.viewingUser);
                } catch (err) {
                  console.error("Error promoting user:", err);
                  alert("Failed to promote user.");
                }
              }}
            >
              Promote to Admin
            </button>
          )}
        </div>
      )}

      <div className="dashboardBox" style={{ maxWidth: 400, marginBottom: 32 }}>
        <h2>Recent Timers</h2>
        {timersHidden? (
          <p>This user has hidden recent timers.</p>
        ) :
        recentTimers.length === 0 ? (
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

      {ownProfile && (
        <div className="dashboardBox">
          <h2>Custom Timer Messages</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label>
              Hydration Message (max 60 chars)  
              <input
                type="text"
                name="hydration"
                value={customMsgs.hydration}
                onChange={handleChange}
                maxLength={60}
              />
            </label>

            <label>
              Stretch Message (max 60 chars)  
              <input
                type="text"
                name="stretch"
                value={customMsgs.stretch}
                onChange={handleChange}
                maxLength={60}
              />
            </label>

            <label>
              Stand Message (max 60 chars)  
              <input
                type="text"
                name="stand"
                value={customMsgs.stand}
                onChange={handleChange}
                maxLength={60}
              />
            </label>

            <label>
              Focus Completion Message (max 25 chars)  
              <input
                type="text"
                name="focusCompletion"
                value={customMsgs.focusCompletion}
                onChange={handleChange}
                maxLength={25}
              />
            </label>
          </div>

          <button
            className="timerButton"
            style={{ marginTop: '16px', width: '100%' }}
            onClick={handleSave}
          >
            Save Messages
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
