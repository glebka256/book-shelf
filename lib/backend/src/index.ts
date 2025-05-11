import express, { ErrorRequestHandler } from 'express';
import https from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import { connectDB } from '@app/config/db';
import router from '@app/router';
import { Logger } from './utils/Logger';
import { errorHandler } from './middlewares/errors';

Logger.enableDebug();

const app = express();

const allowedOrigins = ['http://localhost:8081', 'http://localhost:8085'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = https.createServer(app);

dotenv.config();

connectDB();

const port = process.env.PORT;
const host = process.env.HOST;

server.listen(port, () => {
    Logger.info(`Server running on ${host}`, "APP");
});

app.use('/', router());
app.use(errorHandler as ErrorRequestHandler);