import Task from "../schemas/Task.mjs";
import express from "express";
import { checkSchema, validationResult, matchedData, check } from "express-validator";
import { TaskValidationSchema } from "../utils/TaskValidationSchema.mjs";

let router = express.Router();

router.post("/api/create-task",
    checkSchema(TaskValidationSchema),
    async (req, res) => {
        try {
            let actualData = req.body;
            // console.log(actualData);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors.errors[0].msg,
                    isSaved: false
                });
            }

            const validatedData = matchedData(req);
            const newTask = new Task(validatedData);
            // console.log(newTask);
            
            const savedTask = await newTask.save();
            return res.status(201).json({
                message: "Task created successfully",
                isSaved: true,
                task: savedTask
            });

        } catch (error) {
            console.error("Error in creating task:", error.message);
            return res.status(500).json({
                message: "Task creation failed",
                isSaved: false,
                error: error.message
            });
        }
    }
);


export default router;