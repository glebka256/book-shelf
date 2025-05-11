import { BookData } from "@/types/Book.types";

export interface BooksResponseData {
    currentPage: number,
    totalPages: number,
    totalBooks: number,
    books: BookData[]
}