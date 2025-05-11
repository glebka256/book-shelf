import { AxiosInstance, AxiosResponse } from "axios";
import { booksClient } from "../apiClients";
import { BestBook, BooksData, BookSources} from "@app/interfaces/Books";
import { IBookServiceAdapter } from "./IBookServiceAdapter";

export class BestBooksAdapter implements IBookServiceAdapter {
    apiClient: AxiosInstance;

    constructor() {
        this.apiClient = booksClient;
    }

    async fetchBooks(query: string, page?: number): Promise<BooksData> {
        const options = {
            method: 'GET',
            url: `/genres/${query}/best`,
        }

        const response = await this.apiClient.request(options);

        if (!this.validFetchResponse(response))
            throw new Error("Invalid Best books API response");

        return {
            src: BookSources.GoodreadsBooks,
            books: this.mapData(response.data.books),
            totalResults: response.data.totalResults || response.data.books.length,
            currentPage: page || 1
        }
    }

    async searchBookById(id: string): Promise<BestBook> {
        const options = {
            method: 'GET',
            url: `/books/${id}`,
        }

        const response = await  this.apiClient.request(options);

        if (!response.data)
            throw new Error("Missing data from Best books API response.")

        return this.mapBook(response.data);
    }

    validFetchResponse(response: AxiosResponse): boolean {
        return response.data.books && Array.isArray(response.data.books);
    }

    mapData(rawData: any[]): BestBook[] {
        return rawData.map((book) => this.mapBook(book));
    }

    mapBook(book: any): BestBook {
        return {
            id: book.id,
            title: book.title,
            description: book.description,
            publicationDate: book.publicationDate,
            language: book.language,
            rating: book.rating,
            imageUrl: book.imageUrl,
            genres: book.genres,
            amazonLink: book.amazonLink,
            author: book.author.name
        }
    }
}
