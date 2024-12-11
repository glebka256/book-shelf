import { AxiosInstance, AxiosResponse } from "axios";
import { openLibaryClient } from "../apiClients";
import { IBookServiceAdapter } from "./IBookServiceAdapter";
import { Languages, OpenLibraryBook, BookSources, BooksData } from "@app/interfaces/Books";
import { convertObjectToArray } from "@app/utils";

export class OpenLibraryAdapter implements IBookServiceAdapter {
    apiClient: AxiosInstance;

    constructor() {
        this.apiClient = openLibaryClient;
    }

    async fetchBooks(query: Object, page?: number): Promise<BooksData> {
        const formattedQuery: OpenLibraryQuery = this.formQuery(query);

        const response = await openLibaryClient.get('/search.json', {
            params: { ...formattedQuery }
        });

        if (!this.validFetchResponse(response)) {
            throw new Error ("Invalid Open Library API response");
        }

        return {
            src: BookSources.OpenLibrary,
            books: this.mapData(response.data.docs),
            totalResults: response.data.numFound || response.data.docs.length,
            currentPage: 1
        }
    }

    formQuery(query: any): OpenLibraryQuery {
        const queryParams: OpenLibraryQuery = {
            q: query.q || undefined,
            author: query.author || undefined,
            subject: query.subject || undefined,
            ebook_access: query.freeEbook === true ? 'public' : undefined,
            language: query.language || undefined
        }

        return queryParams;
    }

    validFetchResponse(response: AxiosResponse): boolean {
        return response.data.docs && Array.isArray(response.data.docs);
    }

    mapData(rawData: any[]): OpenLibraryBook[] {
        return rawData.map((book) => ({
            isbn: book.isbn[0],
            title: book.title,
            idGutenberg: book.id_project_gutenberg,
            idGoodreads: book.id_goodreads,
            idAmazon: book.id_amazon,
            language: Object.values(book.language),
            publishYear: book.publish_year[0],
            subject: Object.values(book.subject),
            ratingAverage: book.ratings_average,
            ratingSortable: book.ratings_sortable,
            author: Object.values(book.author_name),
            ebookAcess: book.ebook_access == "public" ? true : false,
        }));
    }
}

interface OpenLibraryQuery {
    q?: string,
    author?: string,
    subject?: string,
    ebook_access?: string,
    language?: Languages,
}
