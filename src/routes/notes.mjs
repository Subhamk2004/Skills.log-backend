import express from "express";
import Note from "../schemas/Note.mjs";

let router = express.Router();

router.get("/api/notes", async (req, res) => {
    try {
        let username = req.user.username;
        let notes = await Note.find
            ({ username: username });
        console.log('fetching notes');

        return res.status(200).json({
            message: "Notes fetched successfully",
            notes: notes,
            success: true
        });
    } catch (error) {
        console.error("Error in fetching notes:", error.message);
        return res.status(500).json({
            message: "Notes fetching failed",
            error: error.message,
            success: false
        });
    }
});

router.delete("/api/notes", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Get user details
        let username;
        if (req.user) {
            username = req.user.usernme;
        }
        let noteId = req.body.id;
        console.log(noteId);

        let note = await Note.findOneAndDelete({ _id: noteId, username: username });
        if (!note) {
            return res.status(404).json({
                message: "Note not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Note deleted successfully",
            success: true
        });
    } catch (error) {
        console.error("Error in deleting note:", error.message);
        return res.status(500).json({
            message: "Note deletion failed",
            error: error.message,
            success: false
        });
    }
});


export default router;