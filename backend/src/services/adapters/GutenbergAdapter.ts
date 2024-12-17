import { AxiosInstance, AxiosResponse } from "axios";
import { projectGutenbergClient } from "../apiClients";
import { IBookServiceAdapter } from "./IBookServiceAdapter";
import { BookSources, BooksData, ProjectGutenbergBook } from "@app/interfaces/Books";

export class GutenbergAdapter implements IBookServiceAdapter {
    apiClient: AxiosInstance;

    constructor() {
        this.apiClient = projectGutenbergClient;
    }

    async fetchBooks(query: string, page=1 ): Promise<BooksData> {
        const response = await this.apiClient.get(`/book/?page=${page}`);
        
        if (!this.validFetchResponse(response)) {
            throw new Error ("Invalid Project Gutenberg API response.");
        }

        return {
            src: BookSources.ProjectGutenberg,
            books: this.mapData(response.data.results),
            totalResults: response.data.count || response.data.results.length,
            currentPage: page
        }
    }

    async searchBookById(id: string): Promise<ProjectGutenbergBook> {
        try {
            const response = await this.apiClient.get(`/book/${id}`);

            if (!response.data) {
                throw new Error ("Invalid Project Gutenberg API response.");
            }

            const bookData = this.mapBook(response.data);

            if (!bookData.resources || bookData.resources.length) {
                console.warn(`Book with ID: ${id} has no resources.`);
            }

            return bookData;
        } catch (error) {
            console.error("Error searching book by ID: ", error);
            return null;
        }
    }

    validFetchResponse(response: AxiosResponse): boolean {
        return response.data.results;
    }

    mapData(rawData: any[]): any[] {
        return rawData.map((book) => (this.mapBook(book)));
    }

    mapBook(book: any): ProjectGutenbergBook {
        return {
            id: book.id,
            title: book.title,
            description: book.description,
            bookShelves: book.bookshelves || [],
            languages: book.languages || ['en'],
            resources: book.resources || []
        }
    }
}
