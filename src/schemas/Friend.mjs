// models/Friend.mjs
import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const friendshipSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
export const Friendship = mongoose.model('Friendship', friendshipSchema);