import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function EditProfile() {
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [hideRecentTimers, setHideRecentTimers] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:5000/api/user', { withCredentials: true })
        .then(res => {
            setUser(res.data)
            setUsername(res.data.username)

            setHideRecentTimers(res.data.settings?.hideRecentTimers ?? false)
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

    const handleToggleTimerVisibility = async () => {
        const newValue = !hideRecentTimers
        setHideRecentTimers(newValue)
        setError('')
        setSuccess('')

        try {
            const res = await axios.put(
                'http://localhost:5000/api/user/settings',
                { hideRecentTimers: newValue },
                { withCredentials: true }
            )

            setHideRecentTimers(res.data.settings.hideRecentTimers)
        } catch (err) {
            console.error('Settings update failed:', err)
            alert('Error updating settings')
        }
    }

    const handleBack = () => {
        navigate(`/profile/${user._id}`)
    }

    const styles = {
        container: {
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            color: '#f8fafc',
            padding: '0',
            margin: '0'
        },
        header: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '24px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: '0',
            zIndex: '100'
        },
        headerContent: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        headerTitle: {
            fontSize: '28px',
            fontWeight: '700',
            margin: '0',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
        },
        headerSubtitle: {
            fontSize: '16px',
            color: '#a5a5b8',
            margin: '0',
            fontWeight: '400'
        },
        backButton: {
            background: 'rgba(165, 165, 184, 0.2)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            color: '#f8fafc',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
        },
        content: {
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '800px',
            margin: '0 auto'
        },
        formCard: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        },
        formTitle: {
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 24px 0',
            color: '#f8fafc'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        label: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#a5a5b8',
            marginBottom: '4px'
        },
        input: {
            background: '#2a2a3e',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '16px',
            color: '#f8fafc',
            fontFamily: 'inherit',
            transition: 'all 0.3s ease',
            outline: 'none'
        },
        submitButton: {
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit',
            marginTop: '8px'
        },
        settingsCard: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        },
        settingsTitle: {
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 24px 0',
            color: '#f8fafc'
        },
        checkboxContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        checkbox: {
            width: '20px',
            height: '20px',
            accentColor: '#6366f1',
            cursor: 'pointer'
        },
        checkboxLabel: {
            fontSize: '16px',
            color: '#f8fafc',
            fontWeight: '500',
            cursor: 'pointer',
            userSelect: 'none'
        },
        errorMessage: {
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#fca5a5',
            fontSize: '14px',
            margin: '8px 0'
        },
        successMessage: {
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#6ee7b7',
            fontSize: '14px',
            margin: '8px 0'
        },
        loading: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            color: '#a5a5b8',
            fontSize: '18px',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
    }
    
    if (!user) return <div style={styles.loading}>Loading...</div>

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.headerTitle}>Edit Profile ✏️</h1>
                    <p style={styles.headerSubtitle}>Update your account information and settings</p>
                </div>
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
            </header>

            <div style={styles.content}>
                <div style={styles.formCard}>
                    <h2 style={styles.formTitle}>Account Information</h2>
                    <form style={styles.form} onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Username</label>
                            <input 
                                type="text" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                required 
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
                            <label style={styles.label}>Current Password</label>
                            <input 
                                type="password" 
                                value={currentPassword} 
                                onChange={e => setCurrentPassword(e.target.value)} 
                                required 
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
                            <label style={styles.label}>New Password</label>
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={e => setNewPassword(e.target.value)} 
                                required 
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
                            <label style={styles.label}>Confirm Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={e => setConfirmPassword(e.target.value)} 
                                required 
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

                        {error && <div style={styles.errorMessage}>{error}</div>}
                        {success && <div style={styles.successMessage}>{success}</div>}

                        <button 
                            type="submit" 
                            style={styles.submitButton}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)'
                                e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'none'
                                e.target.style.boxShadow = 'none'
                            }}
                        >
                            Save Changes
                        </button>
                    </form>
                </div>

                <div style={styles.settingsCard}>
                    <h2 style={styles.settingsTitle}>Profile Settings</h2>
                    <div 
                        style={styles.checkboxContainer}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)'
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={hideRecentTimers}
                            onChange={handleToggleTimerVisibility}
                            style={styles.checkbox}
                        />
                        <label style={styles.checkboxLabel}>
                            Hide recent timers on profile
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile