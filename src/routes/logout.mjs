import express from "express";
import '../strategies/localStrategy.mjs'
import passport from 'passport';

let router = express.Router();

router.get('/api/logout', (req, res) => {

    if (!req.user) return res.sendStatus(200).send({
        message:'User not found',
        success: false
    });

    req.logout((err) => {
        if (err) return res.sendStatus(200).send({
            message:'Error logging out',
            success: false
        });
        req.cookies.isAuthenticated = false;
        req.cookies.useremail = "";
        res.status(200).send({
            message: "User logged out successfully",
            success: true
        });
    });
});

export default router;