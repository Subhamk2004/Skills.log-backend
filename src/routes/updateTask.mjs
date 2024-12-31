import express from "express";
import Task from "../schemas/Task.mjs";

let router = express.Router();

router.put('/api/updateTask', async (req, res) => {
    try {
        let { taskId } = req.body;
        console.log(taskId);
        await Task.updateOne(
            { _id: taskId },
            {
                status: 'completed',
                dueDate: new Date()
            }
        );

        res.status(200).send({
            message: 'OK',
            isSaved: true
        })
    } catch (error) {
        console.log(error);
        res.status(200).send({
            message: error.message,
            isSaved: false
        })
    }
})

export default router;