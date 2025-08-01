import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/friendList.css'
import { useNavigate } from 'react-router-dom'


function FriendList({ user, allUsers = [], refreshUser }) {

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('friends')
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

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
    <div className="friendListContainer">
      <div className="tabButtons">
        <button onClick={() => setActiveTab('friends')} className={activeTab === 'friends' ? 'active' : ''}>Friends</button>
        <button onClick={() => setActiveTab('add')} className={activeTab === 'add' ? 'active' : ''}>Add Friend</button>
        <button onClick={() => setActiveTab('requests')} className={activeTab === 'requests' ? 'active' : ''}>Requests</button>
      </div>

      {/* FRIENDS TAB */}
      {activeTab === 'friends' && (
        <div className="friendCardsGrid">
          {friendObjects.length === 0 ? (
            <p className="noFriendsText">You have no friends yet.</p>
          ) : (
            friendObjects.map((friend) => (
              <div key={friend._id} className="friendCard" onClick={() => navigate(`/profile/${friend._id}`)} style={{ cursor: 'pointer' }}>
                <div className="friendInfo">
                  <h3>{friend.display_name}</h3>
                  <p>@{friend.username}</p>
                </div>
                <button
                  className="removeBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFriend(friend._id);
                  }}>
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
            className="friendSearchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="friendCardsGrid">
            {filteredUsers.length === 0 ? (
              <p className="noFriendsText">No users found.</p>
            ) : (
              filteredUsers.map((userToAdd) => (
                <div key={userToAdd._id} className="friendCard" onClick={() => navigate(`/profile/${userToAdd._id}`)} style={{ cursor: 'pointer' }}>
                  <div className="friendInfo">
                    <h3>{userToAdd.display_name}</h3>
                    <p>@{userToAdd.username}</p>
                  </div>
                  <div className="friendActions">
                    <button
                      className="removeBtn"
                      onClick={() => handleAddFriend(userToAdd._id)}
                    >
                      Add Friend
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="friendCardsGrid">
          {requestObjects.length === 0 ? (
            <p className="noFriendsText">No pending requests.</p>
          ) : (
            requestObjects.map((requester) => (
              <div key={requester._id} className="friendCard" onClick={() => navigate(`/profile/${requester._id}`)} style={{ cursor: 'pointer' }}>
                <div className="friendInfo">
                  <h3>{requester.display_name}</h3>
                  <p>@{requester.username}</p>
                </div>
                <div className="friendActions">
                  <button className="editBtn" onClick={() => handleAcceptRequest(requester._id)}>Accept</button>
                  <button className="removeBtn" onClick={() => handleDeclineRequest(requester._id)}>Decline</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default FriendList
