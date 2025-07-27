import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import '../css/shared-styles.css'
import '../css/profile.css'

function Home() {
  const [user, setUser] = useState(null)
  const [viewingUser, setViewingUser] = useState(null)
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

  console.log(user)
  console.log(viewingUser)

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
    </div>
  )
}

export default Home