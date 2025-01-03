import express from "express";
import passport from "passport";
import '../strategies/localStrategy.mjs';

let router = express.Router();

router.post("/api/login", passport.authenticate("local"), (req, res) => {
    console.log("Session before save:", req.session);

    req.session.save((err) => {
        if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ message: 'Session save failed', error: err.message });
        }

        console.log("Session after save:", req.session);
        res.json({
            user: req.user,
            sessionID: req.sessionID, // Add this for debugging
            success: true
        });
    });
});

router.get('/api/login/status', (req, res) => {
    console.log(req?.user);
    if (req.user) {
        res.status(200).json({
            user: req.user,
            message: 'Authenticated'
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

export default router;