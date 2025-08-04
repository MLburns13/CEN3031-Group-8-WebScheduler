import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function Home() {
  const [user, setUser] = useState(null)
  const [viewingUser, setViewingUser] = useState(null)
  const [recentTimers, setRecentTimers] = useState([])
  const [customMsgs, setCustomMsgs] = useState({hydration: '', stretch: '', stand: '', focusCompletion: ''})
  const navigate = useNavigate()
  const { id } = useParams()
  var ownProfile = false
  const [timersHidden, setTimersHidden] = useState(false)

  // Modern dark theme styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
      color: '#ffffff',
      padding: '0',
      margin: '0',
      paddingBottom: '40px'
    },
    header: {
      background: 'rgba(30, 30, 46, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '0 0 20px 20px',
      padding: '32px 40px',
      marginBottom: '32px',
      position: 'relative',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    headerContent: {
      flex: '1'
    },
    headerTitle: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '8px',
      color: '#ffffff',
      letterSpacing: '-0.5px'
    },
    headerSubtitle: {
      fontSize: '16px',
      color: '#a5a5b8',
      marginBottom: '0',
      fontWeight: '400'
    },
    headerActions: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start'
    },
    button: {
      padding: '12px 20px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    backButton: {
      backgroundColor: 'rgba(165, 165, 184, 0.2)',
      color: '#a5a5b8',
      border: '1px solid rgba(165, 165, 184, 0.3)'
    },
    editButton: {
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      color: '#6366f1',
      border: '1px solid rgba(99, 102, 241, 0.3)'
    },
    content: {
      margin: '0 40px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px'
    },
    dashboardBox: {
      backgroundColor: 'rgba(30, 30, 46, 0.8)',
      padding: '32px',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
    },
    dashboardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#ffffff',
      letterSpacing: '-0.3px'
    },
    timersList: {
      listStyle: 'none',
      padding: '0',
      margin: '0'
    },
    timerItem: {
      backgroundColor: 'rgba(42, 42, 62, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      backdropFilter: 'blur(10px)'
    },
    timerType: {
      fontWeight: '600',
      color: '#6366f1',
      fontSize: '14px'
    },
    timerDetails: {
      color: '#ffffff',
      fontSize: '14px',
      marginTop: '4px'
    },
    timerDate: {
      color: '#a5a5b8',
      fontSize: '12px',
      marginTop: '8px'
    },
    noContent: {
      color: '#a5a5b8',
      fontStyle: 'italic',
      textAlign: 'center',
      padding: '20px'
    },
    formSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '500'
    },
    input: {
      padding: '12px 16px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      fontSize: '14px',
      backgroundColor: '#2a2a3e',
      color: '#ffffff',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    saveButton: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '16px'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      fontSize: '18px',
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
    }
  }

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

  if (!user) return <div style={styles.loading}>Loading...</div>
  if (!viewingUser) return <div style={styles.loading}>Loading profile...</div>

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
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Welcome to {viewingUser.display_name}'s Profile! 👤</h1>
          <p style={styles.headerSubtitle}>Profile Screen</p>
        </div>
        <div style={styles.headerActions}>
          <button 
            style={styles.backButton}
            onClick={handleBack}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(165, 165, 184, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(165, 165, 184, 0.2)'
            }}
          >
            Back
          </button>
          {ownProfile && (
            <button 
              style={styles.editButton}
              onClick={handleEdit}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.2)'
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </header>

      <div style={styles.content}>
        <div style={styles.dashboardBox}>
          <h2 style={styles.dashboardTitle}>Recent Timers</h2>
          {timersHidden ? (
            <div style={styles.noContent}>This user has hidden recent timers.</div>
          ) : recentTimers.length === 0 ? (
            <div style={styles.noContent}>No recent timers found.</div>
          ) : (
            <ul style={styles.timersList}>
              {recentTimers.map((timer, idx) => (
                <li key={timer._id} style={styles.timerItem}>
                  <div style={styles.timerType}>
                    {timer.type === 'focus' ? 'Focus Timer' : 'Popup Timer'}
                  </div>
                  <div style={styles.timerDetails}>
                    {timer.type === 'focus' ? (
                      <>
                        {timer.focusTime} min focus, {timer.breakTime} min break, {timer.longBreakTime} min long break
                      </>
                    ) : (
                      <>
                        {timer.popupName} ({timer.popupCount} times)
                      </>
                    )}
                  </div>
                  <div style={styles.timerDate}>
                    {new Date(timer.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
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
          <div style={styles.dashboardBox}>
            <h2 style={styles.dashboardTitle}>Custom Timer Messages</h2>
            <div style={styles.formSection}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Hydration Message (max 60 chars)</label>
                <input
                  type="text"
                  name="hydration"
                  value={customMsgs.hydration}
                  onChange={handleChange}
                  maxLength={60}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.backgroundColor = '#323244'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.backgroundColor = '#2a2a3e'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Stretch Message (max 60 chars)</label>
                <input
                  type="text"
                  name="stretch"
                  value={customMsgs.stretch}
                  onChange={handleChange}
                  maxLength={60}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.backgroundColor = '#323244'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.backgroundColor = '#2a2a3e'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Stand Message (max 60 chars)</label>
                <input
                  type="text"
                  name="stand"
                  value={customMsgs.stand}
                  onChange={handleChange}
                  maxLength={60}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.backgroundColor = '#323244'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.backgroundColor = '#2a2a3e'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Focus Completion Message (max 25 chars)</label>
                <input
                  type="text"
                  name="focusCompletion"
                  value={customMsgs.focusCompletion}
                  onChange={handleChange}
                  maxLength={25}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.backgroundColor = '#323244'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.backgroundColor = '#2a2a3e'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            <button
              style={styles.saveButton}
              onClick={handleSave}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'none'
                e.target.style.boxShadow = 'none'
              }}
            >
              Save Messages
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
