import mongoose from "mongoose";

let TaskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: false,
        default:'active'
    },
    dueDate: {
        type: Date,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    priority: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Task", TaskSchema);