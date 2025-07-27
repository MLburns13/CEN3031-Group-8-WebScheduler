import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/leaderboard.css'

const Leaderboard = ({ user, allUsers, allTimers }) => {
  const navigate = useNavigate()
  const friendUsers = allUsers.filter(u => user.friendsList.includes(u._id))

  console.log(allTimers)

  const leaderboardData = friendUsers.map(friend => {
    const friendTimers = allTimers.filter(timer => friend.timerSessions.includes(timer._id))

    const focusTime = friendTimers
      .filter(t => t.type === 'focus')
      .reduce((sum, t) => sum + (t.focusTime || 0), 0)

    const popupCount = friendTimers
      .filter(t => t.type === 'popup')
      .reduce((sum, t) => sum + (t.popupCount || 0), 0)

    return {
      id: friend._id,
      display_name: friend.display_name,
      focusTime,
      popupCount,
    }
  })

  leaderboardData.sort((a, b) => b.focusTime - a.focusTime)

  return (
    <div className="leaderboardContainer">
      <h2>Leaderboard</h2>
      <div className="leaderboardHeader">
        <span>#</span>
        <span>Name</span>
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
          <span>{entry.focusTime}</span>
          <span>{entry.popupCount}</span>
        </div>
      ))}
    </div>
  )
}


export default Leaderboard
