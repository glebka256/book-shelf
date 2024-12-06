import { Request, Response } from "express";

import { annasArchiveClient, goodreadsApiClient } from "@app/services/apiClient";
import { AnnasArchiveQuery, BooksData } from '@app/interfaces/Books'
import {
    validGoodreadsResponseData,
    validAnnasResponseData,
    mapGoodreadsBooks, 
    getAnnasArchiveParams, 
    mapAnnasArchiveBooks
} from "@app/services/bookService";

const fetchBooksGoodreads = async (searchQuery: string, pageNumber: number): Promise<BooksData> => {  
    const options = {
        method: 'GET',
        url: `/searchBooks`,
        params: {
            keyword: searchQuery,
            page: pageNumber
        }
    };

    const response = await goodreadsApiClient.request(options);

    if (!validGoodreadsResponseData(response)) {
        throw new Error('Invalid Goodreads API response');
    }

    return {
        books: mapGoodreadsBooks(response.data),
        totalResults: response.data.totalResults || response.data.length,
        currentPage: pageNumber
    }
}

export const getGoodreadsBooks = async (req: Request, res: Response): Promise<void> => {
    const searchQuery = req.params.query;
    const pageNumber = parseInt(req.params.page);

    if (!searchQuery || pageNumber < 1) {
        res.status(400).json({ message: "Search query and fetch result page number are required." });
        return;
    }

    try {
        const goodreadsBookData = await fetchBooksGoodreads(searchQuery, pageNumber);
        
        res.status(200).json(goodreadsBookData.books);
        return;
    } catch (error) {
        res.status(400).json({ message: "Could not fetch books from Goodreads." });
        return;
    }
}

export const fetchBooksAnnasArchive = async (query: AnnasArchiveQuery): Promise<BooksData> => {
    const params = getAnnasArchiveParams(query);

    const options = {
        method: 'GET',
        url: `/search`,
        params: params
    };

    const response = await annasArchiveClient.request(options);

    if (!validAnnasResponseData(response)) {
        throw new Error('Invalid Anna\'s Archive API response');
    }

    const totalResults = response.data.total

    return {
        books: mapAnnasArchiveBooks(response.data.books),
        totalResults: totalResults || response.data.length,
        currentPage: totalResults / 10
    }
}

export const getAnnasArchiveBooks = async (req: Request, res: Response): Promise<void> => {
    const searchQuery = req.params.query;
    const author = req.params.author;
    const categories = req.params.cat;

    if (!searchQuery) {
        res.status(400).json({ message: "Search query is required for Anna's Archive search." });
        return;
    }

    const query: AnnasArchiveQuery = {
        query: searchQuery,
        author: author,
        category: categories
    }

    try {
        const result = await fetchBooksAnnasArchive(query);
        res.status(200).json(result.books);
    } catch (error) {
        res.status(400).json({ message: "Could not fetch books from Anna's Archive."})
        return;
    }
}
