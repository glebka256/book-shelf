import { FetchResponse, Book, SearchResponse, SearchMethod } from "@/types/Book";
import baseInstance from "./baseInstance"
import { getResponseError } from "./main";
import { trimSlash } from "@/utils";

export const getBooksByIds = async (ids: string[]): Promise<FetchResponse> => {
    try {
        const response = await baseInstance.post<Book[]>(
            '/books/batch/', 
            { bookIds: ids }
        );

        return {
            success: true,
            message: "Retrieved User's favorites.",
            data: response.data
        }
    } catch (error) {
        return {
            success: false,
            message: getResponseError(error),
            data: []
        }
    }
}

export const getSearchResults = async (
    query: string, 
    page: number, 
    method: SearchMethod
): Promise<SearchResponse> => {
    try {
        const response = await baseInstance.get(
            `books/${trimSlash(method.path)}/${query}/${page}`
        );

        if (!response.data.searchComplete || !response.data.books) {
            throw new Error("Invalid search service response data.");
        }

        return {
            searchComplete: response.data.searchComplete,
            data: response.data.books
        }
    } catch (error) {
        throw new Error(getResponseError(error));
    }
}

export const getPopularBooks = async (page: number, limit: number): Promise<Book[]> => {
    try {
        const response = await baseInstance.get<Book[]>(
            `/books/popular/${page}/${limit}`
        );

        if (!response.data) {
            throw new Error('Invalid recommendation service response data.');
        }

        return response.data;
    } catch (error) {
        throw new Error(getResponseError(error));
    }
}
