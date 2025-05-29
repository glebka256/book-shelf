import { BookData } from "@/types/Book.types";

export interface BooksResponseData {
    currentPage: number,
    totalPages: number,
    totalBooks: number,
    books: BookData[]
}

export interface SearchResponse {
    searchComplete: boolean,
    books: BookData[]
}

export type SortOrder = 'asc' | 'desc';