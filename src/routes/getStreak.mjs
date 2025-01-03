import express from "express";
import Streak from "../schemas/Streak.mjs";
import Task from "../schemas/Task.mjs";
import { startOfDay, addDays, subDays, isAfter } from 'date-fns';

const router = express.Router();

router.get('/api/streak/', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Get user details
        let username;
        if (req.user) {
            username = req.user.usernme;
        }
        const today = startOfDay(new Date());

        // Get all daily completed tasks for the user
        const tasks = await Task.find({
            username,
            type: 'daily',
            status: 'completed'
        }).sort({ dueDate: -1 });

        // Group tasks by date
        const tasksByDate = tasks.reduce((acc, task) => {
            const dateStr = startOfDay(new Date(task.dueDate)).toISOString();
            if (!acc[dateStr]) {
                acc[dateStr] = [];
            }
            acc[dateStr].push(task);
            return acc;
        }, {});

        // Calculate streaks
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let checkDate = today;

        // Calculate current streak
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
        let dates = Object.keys(tasksByDate).sort();
        for (let i = 0; i < dates.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const currentDate = new Date(dates[i]);
                const prevDate = new Date(dates[i - 1]);
                const dayDiff = Math.abs((currentDate - prevDate) / (1000 * 60 * 60 * 24));

                if (dayDiff === 1) {
                    tempStreak++;
                } else {
                    if (tempStreak > longestStreak) {
                        longestStreak = tempStreak;
                    }
                    tempStreak = 1;
                }
            }
        }
        // Check final tempStreak
        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
        }

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