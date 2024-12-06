import { Request, Response } from "express";

import { goodreadsApiClient } from "@app/services/apiClient";
import { GoodreadsBooksData } from '@app/interfaces/Goodreads'
import { validGoodreadsResponseData, mapGoodreadsBooks } from "@app/services/bookService";

const fetchBooksGoodreads = async (searchQuery: string, pageNumber: number): Promise<GoodreadsBooksData> => {  
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
