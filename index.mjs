import express from "express";
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
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Add this import

dotenv.config();
let app = express();
app.set('trust proxy', 1);

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://performance-tracker-seven.vercel.app',
    'https://skills-log-backend.onrender.com'
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

// Apply CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use((req, res, next) => {
    res.on('header', () => {
        const setCookieHeaders = res.getHeader('Set-Cookie');
        if (setCookieHeaders) {
            res.setHeader(
                'Set-Cookie',
                setCookieHeaders.map((cookie) =>
                    cookie.includes('connect.sid')
                        ? `${cookie}; Partitioned`
                        : cookie
                )
            );
        }
    });
    next();
});

app.use(express.json());

// Keep-alive route
// Keep-alive route
// app.get('/ping', (req, res) => {
//     res.status(200).send('Server is alive');
// });

// Routes
databaseSessionHandler(app);
app.use(Login);
app.use(signup);
app.use(GithubRepo);
app.use(createTask);
app.use(getTasks);
app.use(updateTask);
app.use(StreakRouter);
app.use(createNote);
app.use(notes);
app.use(logout);
app.use(Friend);

app.use((req, res, next) => {
    // console.log(`CORS origin: ${req.headers.origin}`);
    next();
});

app.use((req, res, next) => {
    // console.log('Cookies being sent:', res.getHeaders()['set-cookie']);
    next();
});

// Keep-alive function
// let lastPingTime = Date.now();
// const PING_INTERVAL = 30000; // 30 seconds

// const keepAlive = () => {
//     const currentTime = Date.now();
//     // console.log(`Last ping was ${(currentTime - lastPingTime) / 1000} seconds ago`);

//     fetch('https://skills-log-backend.onrender.com/ping', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })
//         .then(response => {
//             if (response.ok) {
//                 // console.log('Server pinged successfully');
//                 lastPingTime = currentTime;
//             } else {
//                 console.error('Failed to ping server:', response.status);
//             }
//         })
//         .catch(error => {
//             console.error('Error pinging server:', error);
//         });
// };

// // Start the keep-alive interval
// setInterval(keepAlive, PING_INTERVAL);

// Start server
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Initial ping when server starts
    // keepAlive();
});
