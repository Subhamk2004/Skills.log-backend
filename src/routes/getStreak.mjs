import express from "express";
import Streak from "../schemas/Streak.mjs";
import Task from "../schemas/Task.mjs";
import { startOfDay, subDays } from "date-fns";

const router = express.Router();

router.get('/api/streak/', async (req, res) => {
    try {
        const username = req.user.username;
        const today = startOfDay(new Date());

        // Fetch all daily completed tasks for the user
        const tasks = await Task.find({
            username,
            type: 'daily',
        }).sort({ dueDate: 1 }); // Sort by dueDate ascending

        // console.log(tasks);
        

        // Group tasks by normalized start of the day
        const tasksByDate = tasks.reduce((acc, task) => {
            const normalizedDate = startOfDay(new Date(task.dueDate)).toISOString();
            if (!acc[normalizedDate]) {
                acc[normalizedDate] = [];
            }
            acc[normalizedDate].push(task);
            return acc;
        }, {});

        // Calculate current streak
        let currentStreak = 0;
        let checkDate = today;

        while (true) {
            const dateStr = checkDate.toISOString();
            if (tasksByDate[dateStr]) {
                currentStreak++;
                checkDate = subDays(checkDate, 1);
            } else {
                break;
            }
        }

        // Calculate longest streak
        let longestStreak = 0;
        let tempStreak = 0;
        const sortedDates = Object.keys(tasksByDate).map(date => new Date(date)).sort((a, b) => a - b);

        for (let i = 0; i < sortedDates.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const dayDiff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
                if (dayDiff === 1) {
                    tempStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            }
        }

        longestStreak = Math.max(longestStreak, tempStreak);

        // Update or create streak document
        let streakDoc = await Streak.findOne({ username });
        if (!streakDoc) {
            streakDoc = new Streak({
                username,
                streak: currentStreak,
                longestStreak
            });
        } else {
            streakDoc.streak = currentStreak;
            streakDoc.longestStreak = Math.max(longestStreak, streakDoc.longestStreak || 0);
        }

        await streakDoc.save();

        res.status(200).json({
            streak: currentStreak,
            longestStreak: streakDoc.longestStreak,
            message: "Streak calculated successfully",
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
});

export default router;