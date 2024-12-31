import express from "express";
import updateTaskStatus from '../utils/TaskStatusUpdater.mjs'

const router = express.Router();

router.get("/api/tasks", async (req, res) => {
    try {
        // Call updateTaskStatuses directly - no need to fetch tasks first
        const updatedTasks = await updateTaskStatus();
        res.json({
            isSaved: true,
            tasks: updatedTasks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;