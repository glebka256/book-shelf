import { AxiosInstance, AxiosResponse } from "axios";
import { goodreadsApiClient } from "../apiClients";
import { BooksData, BookSources, GoodreadsBook } from "@app/interfaces/Books";
import { IBookServiceAdapter } from "./IBookServiceAdapter";

export class GoodreadsAdapter implements IBookServiceAdapter {
    apiClient: AxiosInstance;

    constructor() {
        this.apiClient = goodreadsApiClient;
    }

    async fetchBooks(query: string, page: number): Promise<BooksData> {
        const options = {
            method: 'GET',
            url: `/searchBooks`,
            params: {
                keyword: query,
                page: page
            }
        };

        const response = await this.apiClient.request(options);

        if (!this.validFetchResponse(response)) {
            throw new Error("Invalid Goodreads API response");
        }

        return {
            src: BookSources.Goodreads,
            books: this.mapData(response.data),
            totalResults: response.data.totalResults || response.data.length,
            currentPage: page || 1
        }
    }

    validFetchResponse(response: AxiosResponse): boolean {
        return response.data && Array.isArray(response.data);
    }

    mapData(rawData: any[]): GoodreadsBook[] {
        return rawData.map((book) => ({
            bookId: book.bookId,
            title: book.title,
            workID: book.workID,
            imageUrl: book.imageUrl,
            bookUrl: book.bookUrl,
            author: this.mapAuthor(book.author),
            rank: parseInt(book.rank),
            rating: parseFloat(book.rating),
            publishedYear: book.publishedYear
        }));
    }

    mapAuthor(authorData: any[]): string {
        return authorData.map((author) => author.name).join(', ');
    }
}
