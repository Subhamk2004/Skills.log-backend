import express from 'express';
import { User } from '../schemas/User.mjs';

const router = express.Router();

// Search users
router.get('/api/friends/search', async (req, res) => {
    try {
        
        const { username } = req.query;
        const users = await User.find({
            username: { $regex: username, $options: 'i' },
            _id: { $ne: req.user._id }
        }).select('username name image');

        const usersWithStatus = await Promise.all(users.map(async user => {
            const hasPendingRequest = await User.findOne({
                _id: user._id,
                'friendRequests.from': req.user._id,
                'friendRequests.status': 'pending'
            });

            return {
                id: user._id,
                username: user.username,
                name: user.name,
                image: user.image,
                requestSent: !!hasPendingRequest
            };
        }));

        res.json(usersWithStatus);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Send friend request
router.post('/api/friends/request', async (req, res) => {
    try {
        const { recipientId } = req.body;

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingRequest = recipient.friendRequests.find(
            req => req.from.toString() === req.user._id.toString() && req.status === 'pending'
        );

        if (existingRequest) {
            return res.status(400).json({ error: 'Friend request already sent' });
        }

        recipient.friendRequests.push({
            from: req.user._id,
            status: 'pending'
        });

        await recipient.save();
        res.json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Handle friend request
router.put('/api/friends/request/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { action } = req.body;

        const user = await User.findById(req.user._id);
        await user.handleFriendRequest(userId, action);

        res.json({ message: `Friend request ${action}` });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get pending friend requests
router.get('/api/friends/requests', async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('friendRequests.from', 'username name image');

        const pendingRequests = user.friendRequests
            .filter(req => req.status === 'pending')
            .map(req => ({
                id: req._id,
                sender: {
                    id: req.from._id,
                    username: req.from.username,
                    name: req.from.name,
                    image: req.from.image
                },
                createdAt: req.createdAt
            }));

        res.json(pendingRequests);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get friends list
router.get('/api/friends', async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('friends', 'username name image status lastActive');

        const friends = user.friends.map(friend => ({
            id: friend._id,
            username: friend.username,
            name: friend.name,
            image: friend.image,
            status: friend.status,
            lastActive: friend.lastActive
        }));

        res.json(friends);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
