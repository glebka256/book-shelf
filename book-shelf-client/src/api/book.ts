import { FetchResponse, Book, SearchResponse, SearchMethod } from "@/types/Book";
import baseInstance from "./baseInstance"
import { getResponseError, serviceError } from "./main";
import { trimSlash } from "@/utils";
import { FilterQuery } from "@/types/Filter";

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

        if (!response.data.books) {
            throw new Error(serviceError('search'));
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
            throw new Error(serviceError('recommendation'));
        }

        return response.data;
    } catch (error) {
        throw new Error(getResponseError(error));
    }
}

export const getFilteredBooks = async (page: number, query: FilterQuery): Promise<Book[]> => {
    const body = {
        'query': query,
        'page': page
    }

    try {
        const response = await baseInstance.post(
            `/books/filter/`,
            body
        );
    
        if (!response.data.books) {
            throw new Error(serviceError('filter'));
        }
    
        return await response.data.books as Book[];
    } catch (error) {
        throw new Error(getResponseError(error));
    }
}

export const getRecommendedBooks = async (page: number): Promise<Book[]> => {
    try {
        const response = await baseInstance.get<Book[]>(
            `/books/user/recommended/${page}`
        );

        if (response.status === 403) {
            throw new Error("Forbidden. Login to view recommendations");
        }

        if (!response.data) {
            throw new Error(serviceError('recommendation'));
        }

        return response.data;
    } catch (error) {
        throw new Error(getResponseError(error));
    }
}