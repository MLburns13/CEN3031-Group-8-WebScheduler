import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import PopupTimer from '../components/popupTimer'
import FriendsList from '../components/friendsList'
import Leaderboard from '../components/leaderboard'

function Home() {
  const [user, setUser] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchError, setSearchError] = useState(null)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [dropdownTimeout, setDropdownTimeout] = useState(null)
  const navigate = useNavigate()
  const [allUsers, setAllUsers] = useState([])
  const [allTimers, setAllTimers] = useState([])

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
    dropdown: {
      position: 'relative',
      display: 'inline-block'
    },
    dropdownButton: {
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      color: '#ffffff',
      padding: '12px 20px',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    dropdownContent: {
      display: dropdownVisible ? 'block' : 'none',
      position: 'absolute',
      backgroundColor: '#1e1e2e',
      minWidth: '160px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      zIndex: 1,
      top: '100%',
      right: '0',
      marginTop: '8px',
      overflow: 'hidden'
    },
    dropdownItem: {
      color: '#ffffff',
      padding: '12px 16px',
      textDecoration: 'none',
      display: 'block',
      border: 'none',
      background: 'transparent',
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s ease'
    },
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '0 40px 32px 40px',
      background: 'rgba(30, 30, 46, 0.6)',
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    },
    searchInput: {
      flex: '1',
      padding: '12px 16px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      fontSize: '14px',
      backgroundColor: '#2a2a3e',
      color: '#ffffff',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    searchButton: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    errorText: {
      color: '#ef4444',
      fontSize: '12px',
      margin: '0',
      padding: '8px 12px',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '8px'
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '24px',
      margin: '0 40px',
      marginBottom: '40px'
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
      marginBottom: '12px',
      color: '#ffffff',
      letterSpacing: '-0.3px'
    },
    dashboardSubtitle: {
      fontSize: '14px',
      color: '#a5a5b8',
      marginBottom: '20px'
    },
    timerButton: {
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
    const init = async () => {
      try {
        const { data: me } = await axios.get('http://localhost:5000/api/user', {
          withCredentials: true,
          validateStatus: status => status < 500
        })
        if (!me || me._id == null) {
          return navigate('/login')
        }
        setUser(me)
        const { data: timers } = await axios.get('http://localhost:5000/api/timers', {
          withCredentials: true
        })
        setAllTimers(timers)
        const { data: users } = await axios.get('http://localhost:5000/api/friends/all-users', {
          withCredentials: true
        })
        setAllUsers(users)

      } catch (err) {
        console.error('Unexpected error in init:', err)
      }
    }

    init()
  }, [navigate])

  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setDropdownVisible(true)
  }

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setDropdownVisible(false)
    }, 200)
    setDropdownTimeout(timeout)
  }

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

  if (!user) return <div style={styles.loading}>Loading...</div>

    return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Welcome, {user.display_name} 👋</h1>
          <p style={styles.headerSubtitle}>Welcome to the WebScheduler. Your productivity journey starts now!</p>
        </div>
        <div style={styles.dropdown}>
          <button 
            style={styles.dropdownButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.3)'
              handleDropdownEnter()
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.2)'
              handleDropdownLeave()
            }}
          >
            {user.username}
          </button>
          <div 
            style={styles.dropdownContent}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <button 
              onClick={handleProfile}
              style={styles.dropdownItem}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
              }}
            >
              Profile
            </button>
            <button 
              onClick={handleLogout}
              style={styles.dropdownItem}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div style={styles.searchContainer}>
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
          style={styles.searchInput}
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
        <button 
          onClick={handleUserSearch}
          style={styles.searchButton}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'none'
            e.target.style.boxShadow = 'none'
          }}
        >
          Search
        </button>
        {searchError && <p style={styles.errorText}>{searchError}</p>}
      </div>

      <div style={styles.dashboardGrid}>
        <div style={styles.dashboardBox}>
          <h2 style={styles.dashboardTitle}>Your Productivity Summary</h2>
          <p style={styles.dashboardSubtitle}>Stats and progress.</p>
        </div>

        <div style={styles.dashboardBox}>
          <h2 style={styles.dashboardTitle}>Popular Tools</h2>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
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
            style={styles.timerButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'none'
              e.target.style.boxShadow = 'none'
            }}
          >
            Focus Timer
          </button>

        </div>

        <div style={{ ...styles.dashboardBox, padding: '24px' }}>
          <Leaderboard leaderboardData={allTimers} />
        </div>
      </div>

      <div style={{ margin: '0 40px 60px 40px' }}>
        <FriendsList user={user} allUsers={allUsers} refreshUser={() => {
          axios.get('http://localhost:5000/api/user', { withCredentials: true })
            .then(res => setUser(res.data))
        }} />
      </div>
    </div>
  )
}

export default Home
