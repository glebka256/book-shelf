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

export const booksClient = axios.create({
    baseURL: process.env.BOOKS_API_BASE_URL,
    headers: {
        'x-rapidapi-key': process.env.BOOKS_API_KEY,
        'x-rapidapi-host': process.env.BOOKS_API_HOST
    }
})

export const openLibaryClient = axios.create({
    baseURL: process.env.OPEN_LIBRARY_BASE_URL,
    headers: {
        'User-Agent': process.env.OPEN_LIBRARY_USER_AGENT
    }
});

export const projectGutenbergClient = axios.create({
    baseURL: process.env.GUTENBERG_API_BASE_URL
});
