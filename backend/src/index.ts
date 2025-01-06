import express from 'express';
import https from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import { connectDB } from '@app/config/db';
import router from '@app/router';
import { Logger } from './utils/Logger';

Logger.enable();

const app = express();

app.use(cors({
    origin: 'http://localhost:8081',
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
    console.log(`Server running on ${host}`);
});

app.use('/', router())
