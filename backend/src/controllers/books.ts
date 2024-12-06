import { goodreadsApiClient } from "@app/services/apiClient";
import { GoodreadsBooksData } from '@app/interfaces/Goodreads'
import { validGoodreadsResponseData, mapGoodreadsBooks } from "@app/services/bookService";

export const fetchBooksGoodreads = async (searchQuery: string, pageNumber: number): Promise<GoodreadsBooksData> => {
    if (!searchQuery || pageNumber < 1) {
        throw new Error('Invalid query for fetchBooksGoodreads');
    }
    
    const options = {
        method: 'GET',
        url: `/searchBooks`,
        params: {
            keyword: searchQuery,
            page: pageNumber
        }
    };

    try {
        const response = await goodreadsApiClient.request(options);

        if (!validGoodreadsResponseData(response)) {
            throw new Error('Invalid Goodreads API response');
        }

        return {
            books: mapGoodreadsBooks(response.data),
            totalResults: response.data.totalResults || response.data.length,
            currentPage: pageNumber
        }
    } catch (error) {
        throw new Error(`Could not fetch books from Goodreads. Error: ${error}`);
    }
}
