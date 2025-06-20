import express, { ErrorRequestHandler } from 'express';
import https from 'http';

// Register path alias configuration
import path from 'path';
import { register } from 'tsconfig-paths';
import tsConfig from '../tsconfig.json'; 

register({
  baseUrl: path.resolve(__dirname),
  paths: tsConfig.compilerOptions.paths as any
});

import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import { connectDB } from '@app/config/db';
import router from '@app/router';
import { Logger } from './utils/Logger';
import { errorHandler } from './middlewares/errors';

dotenv.config();

Logger.enableDebug();

const app = express();


// CORS
const allowedOrigins = [
    'http://localhost:8080', 
    'http://localhost:8081', 
    'http://localhost:8085', 
    'https://book-shelf-5ah9.onrender.com'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS: ' + origin));
        }
    },
    credentials: true,
}));


app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());


// Serve client Vue app
const clientPath = path.join(__dirname, '../../client-shelf/dist');
app.use('/', express.static(clientPath));

// Serve admin Vue app
const adminPath = path.join(__dirname, '../../admin-shelf/dist');
app.use('/admin', express.static(adminPath));

// Serve webAPI app
app.use('/api', router());

// SPA Fallbacks
app.get('/admin/*', (_req, res) => {
    res.sendFile(path.join(adminPath, 'index.html'));
});

app.get('/*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});


app.use(errorHandler as ErrorRequestHandler);

connectDB();

const port = process.env.PORT;
const host = process.env.HOST;

const server = https.createServer(app);
server.listen(port, () => {
    Logger.info(`Server running on ${host}`, "APP");
});