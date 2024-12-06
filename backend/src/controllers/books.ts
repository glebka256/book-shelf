import { Request, Response } from "express";

import { annasArchiveClient, goodreadsApiClient } from "@app/services/apiClient";
import { AnnasArchiveQuery, BooksData } from '@app/interfaces/Goodreads'
import {
    validFetchResponseData,
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

    if (!validFetchResponseData(response)) {
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

export const fetchBooksAnnasArchive = async (query: AnnasArchiveQuery) => {
    const params = getAnnasArchiveParams(query);

    const options = {
        method: 'GET',
        url: `/search`,
        params: params
    };

    const response = await annasArchiveClient.request(options);
    if (!validFetchResponseData(response)) {
        throw new Error('Invalid Anna\'s Archive API response');
    }

    const totalResults = response.data.totalResults

    return {
        books: mapAnnasArchiveBooks(response.data),
        totalResults: totalResults || response.data.length,
        currentPage: totalResults / 10
    }
}
