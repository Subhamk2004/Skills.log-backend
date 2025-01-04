import express from "express";
import Note from "../schemas/Note.mjs";
import { NoteValidationSchema } from "../utils/NoteValidationSchema.mjs";
import { checkSchema, validationResult, matchedData, check } from "express-validator";

let router = express.Router();

router.post("/api/create-note",
    checkSchema(NoteValidationSchema),
    async (req, res) => {
        try {
            let actualData = req.body;
            let username = req.user.username;
            // console.log(actualData);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                
                return res.status(200).json({
                    message: errors.errors[0].msg,
                    isSaved: false
                });
            }

            const validatedData = matchedData(req);
            const newNote = new Note(validatedData);
            // console.log(newNote);
            
            const savedNote = await newNote.save();
            return res.status(201).json({
                message: "Note created successfully",
                isSaved: true,
                note: savedNote
            });

        } catch (error) {
            console.error("Error in creating note:", error.message);
            return res.status(500).json({
                message: "Note creation failed",
                isSaved: false,
                error: error.message
            });
        }
    }
);


export default router;