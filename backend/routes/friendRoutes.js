const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Send Friend Request
router.post('/request', async (req, res) => {
  console.log('[POST /api/friends/request] Hit route');
  const { fromUserId, toUserId } = req.body;

  if (fromUserId === toUserId) return res.status(400).json({ msg: "You can't add yourself." });

  try {
    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ msg: "User not found." });

    if (
      toUser.friendRequests.includes(fromUserId) ||
      toUser.friendsList.includes(fromUserId)
    ) {
      return res.status(400).json({ msg: "Already requested or already friends." });
    }

    toUser.friendRequests.push(fromUserId);
    await toUser.save();

    res.json({ msg: "Friend request sent." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept Friend Request
router.post('/accept', async (req, res) => {
  const { userId, requesterId } = req.body;

  try {
    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) return res.status(404).json({ msg: "User not found" });

    if (!user.friendRequests.includes(requesterId)) {
      return res.status(400).json({ msg: "No such friend request" });
    }

    // Add each other as friends
    user.friendsList.push(requesterId);
    requester.friendsList.push(userId);

    // Remove the request
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);

    await user.save();
    await requester.save();

    res.json({ msg: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Decline Friend Request
router.post('/decline', async (req, res) => {
  const { userId, requesterId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
    await user.save();

    res.json({ msg: "Friend request declined" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove Friend
router.post('/remove', async (req, res) => {
  console.log('[POST /api/friends/remove] Hit route');
  const { userId, targetUserId } = req.body;
  console.log('[POST /api/friends/remove] Request body:', req.body);

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);
    
    if (!user || !targetUser) return res.status(404).json({ msg: "User not found" });
    
    user.friendsList = user.friendsList.filter(id => id.toString() !== targetUserId);
    targetUser.friendsList = targetUser.friendsList.filter(id => id.toString() !== userId);
    
    await user.save();
    await targetUser.save();
    
    console.log('[POST /api/friends/remove] Successfully saved both users');
    res.json({ msg: "Friend removed" });
  } catch (err) {
    console.error('[POST /api/friends/remove] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({}, 'username display_name _id')
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router;
