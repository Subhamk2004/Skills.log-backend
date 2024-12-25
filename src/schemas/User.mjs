import mongoose from 'mongoose'

let UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    githubUsername: {
        type: String,
        required: false,
    },
    pat: {
        type: String,
        required: false,
    },
    institute: {
        type: String,
        required: true,
    },
    primaryWork: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    skills: {
        type: [String],
        required: false,
    },
    projects: {
        type: [String],
        required: false,
    },
    friends: {
        type: [String],
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
})

export let User = mongoose.model('User',UserSchema);