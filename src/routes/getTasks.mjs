import express from "express";
import Task from "../schemas/Task.mjs";

const router = express.Router();

router.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json({isSaved: true,
            tasks: tasks,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;