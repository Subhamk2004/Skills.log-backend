import mongoose from "mongoose";

let NoteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    hashtags: {
        type: [String],
        default: [],
    }
})

export default mongoose.model("Note", NoteSchema);