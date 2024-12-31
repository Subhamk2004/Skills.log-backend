import mongoose from "mongoose"

let StreakSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    streak: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    longestStreak: {
        type: Number,
        required: false,
    }
});

export default mongoose.model("Streak", StreakSchema);
