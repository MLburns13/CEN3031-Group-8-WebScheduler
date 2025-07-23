import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/shared-styles.css'

function EditProfile() {
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:5000/api/user', { withCredentials: true })
        .then(res => {
            setUser(res.data)
            setUsername(res.data.username)
        })
        .catch(() => navigate('/login'))
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (newPassword !== confirmPassword) {
        setError('Passwords do not match')
        return
        }

        try {
        await axios.put(`http://localhost:5000/edit-profile`, {
            username, currentPassword, newPassword
        }, 
        { withCredentials: true })

        alert('Profile updated successfully!')
        navigate(`/profile/${user._id}`)
        } 
        catch (err) {
            console.error(err)
            if(err.response && err.response.status === 401) {
                setError("Incorrect password entered")
            }
            else {
                setError('Failed to update profile')
            }
        }
    }

    const handleBack = () => {
        navigate(`/profile/${user._id}`)
    }
    
    if (!user) return <p>Loading...</p>

    return (
        <div className="homeContainer">
            <div className="welcomeBanner">
            <h2>Edit Profile</h2>
            <div className="accountDropdown">
                <button className="accountDropdownButton" onClick={handleBack}>
                    Back
                </button> 
            </div>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    required 
                />

                <label>Current Password:</label>
                <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    required 
                />

                <label>New Password:</label>
                <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    required 
                />

                <label>Confirm Password:</label>
                <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                />

                {error && <p className="errorMessage">{error}</p>}
                {success && <p className="successMessage">{success}</p>}

                <button type="submit">Save Changes</button>
            </form>
            </div>
        </div>
    )
}

export default EditProfile