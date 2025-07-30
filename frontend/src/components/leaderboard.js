import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/leaderboard.css'

const Leaderboard = ({ leaderboardData }) => {
    const navigate = useNavigate()
    const [sortBy, setSortBy] = useState('totalFocusTime')
    const sortedData = [...leaderboardData].sort((a, b) => b[sortBy] - a[sortBy])

    const toggleSort = () => {
        setSortBy(prev => (prev === 'totalFocusTime' ? 'totalPopupCount' : 'totalFocusTime'))
    }

    return (
        <div className="leaderboardContainer">
      <div className="leaderboardHeaderRow">
        <h2>Leaderboard</h2>
        <button onClick={toggleSort} className="toggleSortButton">
          Sort by {sortBy === 'totalFocusTime' ? 'Popup Count' : 'Focus Time'}
        </button>
      </div>
      <div className="leaderboardHeader">
        <span>#</span>
        <span>Name</span>
        <span>Username</span>
        <span>Focus Time</span>
        <span>Popup Count</span>
      </div>
      {sortedData.map((entry, index) => (
        <div
          key={entry.userId}
          className="leaderboardRow clickable"
          onClick={() => navigate(`/profile/${entry.userId}`)}
        >
          <span>{index + 1}</span>
          <span>{entry.display_name}</span>
          <span>{'@' + entry.username}</span>
          <span>{entry.totalFocusTime}</span>
          <span>{entry.totalPopupCount}</span>
        </div>
      ))}
    </div>
    )
}

export default Leaderboard
