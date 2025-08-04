import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function FriendList({ user, allUsers = [], refreshUser }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('friends')
  const [searchTerm, setSearchTerm] = useState('')

  // Dark theme styles
  const styles = {
    container: {
      backgroundColor: 'rgba(30, 30, 46, 0.8)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden'
    },
    tabButtons: {
      display: 'flex',
      backgroundColor: 'rgba(42, 42, 62, 0.6)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    tabButton: {
      flex: '1',
      padding: '16px 20px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#a5a5b8',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      borderBottomWidth: '2px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'transparent'
    },
    tabButtonActive: {
      color: '#ffffff',
      borderBottomColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)'
    },
    content: {
      padding: '24px'
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      fontSize: '14px',
      backgroundColor: '#2a2a3e',
      color: '#ffffff',
      outline: 'none',
      transition: 'all 0.3s ease',
      marginBottom: '20px',
      boxSizing: 'border-box'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px'
    },
    card: {
      backgroundColor: 'rgba(42, 42, 62, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },
    cardHover: {
      backgroundColor: 'rgba(42, 42, 62, 0.8)',
      borderColor: 'rgba(99, 102, 241, 0.3)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
    },
    friendInfo: {
      marginBottom: '16px'
    },
    friendName: {
      color: '#ffffff',
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '4px',
      margin: '0 0 4px 0'
    },
    friendUsername: {
      color: '#a5a5b8',
      fontSize: '14px',
      margin: '0'
    },
    friendActions: {
      display: 'flex',
      gap: '8px'
    },
    button: {
      padding: '10px 16px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      flex: '1'
    },
    acceptButton: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '10px'
    },
    removeButton: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '10px'
    },
    addButton: {
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      color: '#6366f1',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '10px'
    },
    noContentText: {
      color: '#a5a5b8',
      textAlign: 'center',
      fontSize: '14px',
      fontStyle: 'italic',
      padding: '40px 20px'
    }
  }

  const handleAddFriend = async (targetUserId) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/friends/request',
        {
          fromUserId: user._id,
          toUserId: targetUserId
        },
        { withCredentials: true }
      )
      alert(res.data.msg || 'Friend request sent')
      refreshUser()
    } catch (err) {
      console.error(err)
      alert('Failed to send friend request')
    }
  }

  const handleRemoveFriend = async (targetUserId) => {
    console.log('[Frontend] handleRemoveFriend called with targetUserId:', targetUserId);
    console.log('[Frontend] Current user object:', user);
    console.log('[Frontend] User ID:', user?._id);
    
    try {
      const requestData = {
        userId: user._id,
        targetUserId
      };
      console.log('[Frontend] Sending request data:', requestData);
      
      const res = await axios.post(
        'http://localhost:5000/api/friends/remove',
        requestData,
        { withCredentials: true }
      )
      console.log('[Frontend] Response received:', res.data);
      alert(res.data.msg || 'Friend removed')
      refreshUser()
    } catch (err) {
      console.error('[Frontend] Error removing friend:', err)
      console.error('[Frontend] Error response:', err.response?.data);
      alert('Failed to remove friend: ' + (err.response?.data?.msg || err.message))
    }
  }

  const handleAcceptRequest = async (requesterId) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/friends/accept',
        {
          userId: user._id,
          requesterId
        },
        { withCredentials: true }
      )
      alert(res.data.msg || 'Friend request accepted')
      refreshUser()
    } catch (err) {
      console.error(err)
      alert('Failed to accept friend request')
    }
  }

  const handleDeclineRequest = async (requesterId) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/friends/decline',
        {
          userId: user._id,
          requesterId
        },
        { withCredentials: true }
      )
      alert(res.data.msg || 'Request declined')
      refreshUser()
    } catch (err) {
      console.error(err)
      alert('Failed to decline friend request')
    }
  }

  const filteredUsers = allUsers.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
    u._id !== user._id &&
    !user.friendsList.includes(u._id) &&
    !user.friendRequests.includes(u._id)
  )

  const friendObjects = allUsers.filter(
    u => user.friendsList.map(id => id.toString()).includes(u._id.toString())
  );
  const requestObjects = allUsers.filter(u => user.friendRequests.includes(u._id))

  return (
    <div style={styles.container}>
      <div style={styles.tabButtons}>
        <button 
          onClick={() => setActiveTab('friends')} 
          style={activeTab === 'friends' ? { ...styles.tabButton, ...styles.tabButtonActive } : styles.tabButton}
          onMouseEnter={(e) => {
            if (activeTab !== 'friends') {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
              e.target.style.color = '#ffffff'
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'friends') {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = '#a5a5b8'
            }
          }}
        >
          Friends
        </button>
        <button 
          onClick={() => setActiveTab('add')} 
          style={activeTab === 'add' ? { ...styles.tabButton, ...styles.tabButtonActive } : styles.tabButton}
          onMouseEnter={(e) => {
            if (activeTab !== 'add') {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
              e.target.style.color = '#ffffff'
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'add') {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = '#a5a5b8'
            }
          }}
        >
          Add Friend
        </button>
        <button 
          onClick={() => setActiveTab('requests')} 
          style={activeTab === 'requests' ? { ...styles.tabButton, ...styles.tabButtonActive } : styles.tabButton}
          onMouseEnter={(e) => {
            if (activeTab !== 'requests') {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
              e.target.style.color = '#ffffff'
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'requests') {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.color = '#a5a5b8'
            }
          }}
        >
          Requests
        </button>
      </div>

      <div style={styles.content}>
        {/* FRIENDS TAB */}
        {activeTab === 'friends' && (
          <div style={styles.grid}>
            {friendObjects.length === 0 ? (
              <div style={styles.noContentText}>You have no friends yet.</div>
            ) : (
              friendObjects.map((friend) => (
                <div 
                  key={friend._id} 
                  style={styles.card}
                  onClick={() => navigate(`/profile/${friend._id}`)}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.cardHover)
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, styles.card)
                  }}
                >
                  <div style={styles.friendInfo}>
                    <h3 style={styles.friendName}>{friend.display_name}</h3>
                    <p style={styles.friendUsername}>@{friend.username}</p>
                  </div>
                  <button
                    style={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFriend(friend._id);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    Remove Friend
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ADD FRIEND TAB */}
        {activeTab === 'add' && (
          <>
            <input
              type="text"
              placeholder="Search users..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <div style={styles.grid}>
              {filteredUsers.length === 0 ? (
                <div style={styles.noContentText}>No users found.</div>
              ) : (
                filteredUsers.map((userToAdd) => (
                  <div 
                    key={userToAdd._id} 
                    style={styles.card}
                    onClick={() => navigate(`/profile/${userToAdd._id}`)}
                    onMouseEnter={(e) => {
                      Object.assign(e.currentTarget.style, styles.cardHover)
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.currentTarget.style, styles.card)
                    }}
                  >
                    <div style={styles.friendInfo}>
                      <h3 style={styles.friendName}>{userToAdd.display_name}</h3>
                      <p style={styles.friendUsername}>@{userToAdd.username}</p>
                    </div>
                    <button
                      style={styles.addButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddFriend(userToAdd._id);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.2)'
                      }}
                    >
                      Add Friend
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* REQUESTS TAB */}
        {activeTab === 'requests' && (
          <div style={styles.grid}>
            {requestObjects.length === 0 ? (
              <div style={styles.noContentText}>No pending requests.</div>
            ) : (
              requestObjects.map((requester) => (
                <div 
                  key={requester._id} 
                  style={styles.card}
                  onClick={() => navigate(`/profile/${requester._id}`)}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.cardHover)
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, styles.card)
                  }}
                >
                  <div style={styles.friendInfo}>
                    <h3 style={styles.friendName}>{requester.display_name}</h3>
                    <p style={styles.friendUsername}>@{requester.username}</p>
                  </div>
                  <div style={styles.friendActions}>
                    <button 
                      style={styles.acceptButton} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptRequest(requester._id);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.2)'
                      }}
                    >
                      Accept
                    </button>
                    <button 
                      style={styles.removeButton} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeclineRequest(requester._id);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FriendList
