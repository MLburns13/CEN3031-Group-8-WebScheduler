import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/leaderboard.css'

const Leaderboard = ({ user, allUsers, allTimers }) => {
    const navigate = useNavigate()

    const [sortBy, setSortBy] = useState('focusTime')

    const leaderboardUsers = allUsers.filter(u =>
    user.friendsList.includes(u._id) || u._id === user._id
    )

    const leaderboardData = leaderboardUsers.map(leaderboardUser => {
        const userTimerSummary = allTimers.find(t => t.userId === leaderboardUser._id)
        const focusTime = userTimerSummary?.totalFocusTime || 0
        const popupCount = userTimerSummary?.totalPopupCount || 0

        return {
        id: leaderboardUser._id,
        display_name: leaderboardUser.display_name,
        username: leaderboardUser.username,
        focusTime,
        popupCount,
        }
    })

    leaderboardData.sort((a, b) => b[sortBy] - a[sortBy])

    const toggleSort = () => {
        setSortBy(prev => (prev === 'focusTime' ? 'popupCount' : 'focusTime'))
    }

    return (
        <div className="leaderboardContainer">
      <div className="leaderboardHeaderRow">
        <h2>Leaderboard</h2>
        <button onClick={toggleSort} className="toggleSortButton">
          Sort by {sortBy === 'focusTime' ? 'Popup Count' : 'Focus Time'}
        </button>
      </div>
      <div className="leaderboardHeader">
        <span>#</span>
        <span>Name</span>
        <span>Username</span>
        <span>Focus Time</span>
        <span>Popup Count</span>
      </div>
      {leaderboardData.map((entry, index) => (
        <div
          key={entry.id}
          className="leaderboardRow clickable"
          onClick={() => navigate(`/profile/${entry.id}`)}
        >
          <span>{index + 1}</span>
          <span>{entry.display_name}</span>
          <span>{'@' + entry.username}</span>
          <span>{entry.focusTime}</span>
          <span>{entry.popupCount}</span>
        </div>
      ))}
    </div>
    )
}

export default Leaderboard
