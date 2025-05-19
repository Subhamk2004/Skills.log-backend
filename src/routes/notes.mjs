import express from "express";
import Note from "../schemas/Note.mjs";
let router = express.Router();

router.get("/api/notes", async (req, res) => {
  try {
    let username = req.user.username;
    let notes = await Note.find({ username: username });
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
      username = req.user.username;
    }
    let noteId = req.body.id;
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

// Add the update route
router.put("/api/notes", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    let username = req.user.username;
    let { id, title, content, hashtags } = req.body;
    
    // Make sure only the owner can update their notes
    let existingNote = await Note.findOne({ _id: id, username: username });
    if (!existingNote) {
      return res.status(404).json({
        message: "Note not found or you don't have permission to update it",
        success: false
      });
    }
    
    // Update the note
    let updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, hashtags },
      { new: true } // Return the updated document
    );
    
    return res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
      success: true
    });
  } catch (error) {
    console.error("Error in updating note:", error.message);
    return res.status(500).json({
      message: "Note update failed",
      error: error.message,
      success: false
    });
  }
});

export default router;