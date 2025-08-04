import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Leaderboard = ({ leaderboardData }) => {
    const navigate = useNavigate()
    const [sortBy, setSortBy] = useState('totalFocusTime')
    const sortedData = [...leaderboardData].sort((a, b) => b[sortBy] - a[sortBy])

    // Dark theme styles
    const styles = {
        container: {
            color: '#ffffff'
        },
        headerRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
        },
        title: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#ffffff',
            margin: '0',
            letterSpacing: '-0.3px'
        },
        toggleButton: {
            padding: '8px 16px',
            background: 'rgba(99, 102, 241, 0.2)',
            color: '#6366f1',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        header: {
            display: 'grid',
            gridTemplateColumns: '40px 1fr 1fr 80px 80px',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'rgba(42, 42, 62, 0.6)',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#a5a5b8',
            marginBottom: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        row: {
            display: 'grid',
            gridTemplateColumns: '40px 1fr 1fr 80px 80px',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'rgba(42, 42, 62, 0.4)',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '4px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        rowHover: {
            backgroundColor: 'rgba(42, 42, 62, 0.8)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            transform: 'translateX(4px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        },
        rank: {
            fontWeight: '700',
            color: '#6366f1'
        },
        username: {
            color: '#a5a5b8',
            fontSize: '12px'
        }
    }

    const toggleSort = () => {
        setSortBy(prev => (prev === 'totalFocusTime' ? 'totalPopupCount' : 'totalFocusTime'))
    }

    return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <h2 style={styles.title}>Leaderboard</h2>
                <button 
                    onClick={toggleSort} 
                    style={styles.toggleButton}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.2)'
                    }}
                >
                    Sort by {sortBy === 'totalFocusTime' ? 'Popup Count' : 'Focus Time'}
                </button>
            </div>
            <div style={styles.header}>
                <span>#</span>
                <span>Name</span>
                <span>Username</span>
                <span>Focus Time</span>
                <span>Popup Count</span>
            </div>
            {sortedData.map((entry, index) => (
                <div
                    key={entry.userId}
                    style={styles.row}
                    onClick={() => navigate(`/profile/${entry.userId}`)}
                    onMouseEnter={(e) => {
                        Object.assign(e.currentTarget.style, { ...styles.row, ...styles.rowHover })
                    }}
                    onMouseLeave={(e) => {
                        Object.assign(e.currentTarget.style, styles.row)
                    }}
                >
                    <span style={styles.rank}>{index + 1}</span>
                    <span>{entry.display_name}</span>
                    <span style={styles.username}>@{entry.username}</span>
                    <span>{entry.totalFocusTime}</span>
                    <span>{entry.totalPopupCount}</span>
                </div>
            ))}
        </div>
    )
}

export default Leaderboard
