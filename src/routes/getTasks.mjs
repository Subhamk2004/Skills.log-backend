import express from "express";
import updateTaskStatus from '../utils/TaskStatusUpdater.mjs'

const router = express.Router();

router.get("/api/tasks", async (req, res) => {
    try {
        // Call updateTaskStatuses directly - no need to fetch tasks first
        console.log('Updating task statuses');
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Get user details
        let username;
        if (req.user) {
            username = req.user.usernme;
        }
        const updatedTasks = await updateTaskStatus(username);
        console.log(updatedTasks);

        res.json({
            isSaved: true,
            tasks: updatedTasks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;