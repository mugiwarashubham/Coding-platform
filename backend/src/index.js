const express = require('express')
const app = express()
require('dotenv').config();
const main = require('./config/db')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/userauthentication');
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemcreator");
const submitRouter = require("./routes/submit")
const cors = require('cors')
const aiRouter = require("./routes/aichatting")

// Allowed frontend origins (add/remove as needed)
const allowedOrigins = [
    'https://coding-platform-ull7.vercel.app',
    'https://coding-platform-kvis.vercel.app',
    'http://localhost:5173' // local dev
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like Postman, curl, mobile apps)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS: ' + origin));
        }
    },
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);

const IntializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB connected")
        app.listen(process.env.PORT, () => {
            console.log("server listening at port no:" + process.env.PORT);
        });
    }
    catch (err) {
        console.log("Error:" + err);
    }
}

IntializeConnection();