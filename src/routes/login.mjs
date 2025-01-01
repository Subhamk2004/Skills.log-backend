import express from "express";
import passport from "passport";
import '../strategies/localStrategy.mjs';

let router = express.Router();

router.post("/api/login", passport.authenticate("local"),
    (req, res) => {
        console.log("Inside login route");
        console.log(req.session.passport.user);
        req.session.save((err) => {
            if (err) {
                return res.status(500).json({ message: 'Could not save session' });
            }
            res.json({ user: req.user });
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