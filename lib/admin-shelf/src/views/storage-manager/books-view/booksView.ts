import baseInstance from "@/config/axios"
import { BooksResponseData, SearchResponse, SortOrder } from "./booksView.types";

export const getPaginatedBooks = async (page: number, limit: number): Promise<BooksResponseData> => {
    const response = await baseInstance.get<BooksResponseData>(
        `/books/paginated/${page}/${limit}`
    );

    return response.data;
}

// For some reason backend search has predefined limit
export const getBookSearch = async (page: number, query: string): Promise<SearchResponse> => {
    const response = await baseInstance.get<SearchResponse>(
        `/books/search/${query}/${page}`
    );

    return response.data;
}

export const getSortedBooks = async (
    page: number, 
    limit: number, 
    sortBy: string, 
    order: SortOrder
): Promise<BooksResponseData> => {
    const response = await baseInstance.post<BooksResponseData>(
        `/books/sorted/${page}/${limit}`,
        {
            sortBy: sortBy,
            order: order
        }
    );

    return response.data;
}