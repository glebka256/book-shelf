import express from 'express';
import https from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = https.createServer(app);

dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const MONGO_URI = process.env.MONGO_URI;

console.log(MONGO_URI)

server.listen(PORT, () => {
    console.log(`Server running on ${HOST}`);
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI);
mongoose.connection.on('error', (error: Error) => console.log('Error'));
