import axios from "axios";

// I dont know why it should be done twice but otherwise breaks .env processing
import dotenv from 'dotenv';
dotenv.config();

export const goodreadsApiClient = axios.create({
    baseURL: process.env.GOODREADS_BASE_URL,
    headers: {
        'x-rapidapi-key': process.env.GOODREAD_API_KEY,
        'x-rapidapi-host': process.env.GOODREAD_API_HOST
    }
});

export const annasArchiveClient = axios.create({
    baseURL: process.env.ANNAS_ARCHIVE_BASE_URL,
    headers: {
        'x-rapidapi-key': process.env.ANNAS_ARCHIVE_API_KEY,
        'x-rapidapi-host': process.env.ANNAS_ARCHIVE_API_HOST
    }
})
