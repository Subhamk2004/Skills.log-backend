import express from "express";
import { User } from "../schemas/User.mjs";
import { createUserValidationSchema } from "../utils/validateSchema.mjs";
import { checkSchema, validationResult, matchedData } from 'express-validator';
import cloudinary from 'cloudinary';
import multer from "multer";
import dotenv from 'dotenv';
import { encryptPassword } from "../utils/passwordEncryptor.mjs";
import { encrypt, decrypt } from '../utils/patEncryptor.mjs';


dotenv.config();

let router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ dest: 'uploads/' });

router.post('/api/signup',
    upload.single('image'),
    async (req, res, next) => {
        try {
            const user = req.body;
            // console.log(user);

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                user.image = result.secure_url;
            }
            req.validatedUser = user; // Pass user to the next middleware
            next();
        } catch (error) {
            console.error("Error in file upload:", error.message);
            return res.status(500).json({ message: "File upload failed", error: error.message });
        }
    },
    checkSchema(createUserValidationSchema),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors.errors[0].msg,
                    isSaved: false
                });
            }

            const validatedData = matchedData(req);
            validatedData.password = encryptPassword(validatedData.password);
            validatedData.pat = encrypt(validatedData.pat);

            const newUser = new User({ ...req.validatedUser, ...validatedData });

            const savedUser = await newUser.save();
            return res.status(201).json({
                message: 'User registered successfully',
                isSaved: true,
                user: savedUser
            });
        } catch (error) {
            console.error("Error in user registration:", error);
            return res.status(500).json({
                message: "User registration failed",
                isSaved: false,
                error: error.message
            });
        }
    }
);

export default router;
