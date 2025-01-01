import express from "express";
import { configDotenv } from "dotenv";
import GithubRepo from "./src/routes/GithubRepo.mjs";
import cors from "cors";
import databaseSessionHandler from "./src/utils/DatabaseSessionHandler.mjs";
import signup from "./src/routes/signup.mjs";
import Login from "./src/routes/login.mjs";
import createTask from "./src/routes/createTask.mjs";
import getTasks from "./src/routes/getTasks.mjs";
import updateTask from './src/routes/updateTask.mjs'
import StreakRouter from './src/routes/getStreak.mjs'
import createNote from "./src/routes/createNote.mjs";
import notes from "./src/routes/notes.mjs";
import logout from "./src/routes/logout.mjs";
import Friend from './src/routes/Friend.mjs';


let app = express();
app.use(express.json());

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://performance-tracker-seven.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
let PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

databaseSessionHandler(app);
app.use(GithubRepo);
app.use(signup);
app.use(Login);
app.use(createTask);
app.use(getTasks);
app.use(updateTask);
app.use(StreakRouter);
app.use(createNote);
app.use(notes);
app.use(logout);
app.use(Friend);