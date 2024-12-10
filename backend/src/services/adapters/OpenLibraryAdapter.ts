import { AxiosInstance, AxiosResponse } from "axios";
import { openLibaryClient } from "../apiClients";
import { IBookServiceAdapter } from "./IBookServiceAdapter";
import { Languages, OpenLibraryBook, BookSources, BooksData } from "@app/interfaces/Books";
import { convertObjectToArray, getUrlSearchParams } from "@app/utils";

export class OpenLibraryAdapter implements IBookServiceAdapter {
    apiClient: AxiosInstance;

    constructor() {
        this.apiClient = openLibaryClient;
    }

    async fetchBooks(query: Object, page?: number): Promise<BooksData> {
        const response = await openLibaryClient.get('/search.json', {
            params: { q: this.formQuery(query) }
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

    formQuery(query: any): string {
        const queryParams: openLibraryQuery = {
            q: query.q || '',
            author: query.author || '',
            subject: query.subject || '',
            ebook_access: query.freeEbook === true ? 'public' : '',
            language: query.language
        }

        return getUrlSearchParams(queryParams);
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
            language: convertObjectToArray(book.language),
            publishYear: book.publish_year[0],
            subject: convertObjectToArray(book.subject),
            ratingAverage: book.ratings_average,
            ratingSortable: book.ratings_sortable,
            author: convertObjectToArray(book.author_name),
            ebookAcess: book.ebook_access == "public" ? true : false,
        }));
    }
}

interface openLibraryQuery {
    q?: string,
    author?: string,
    subject?: string,
    ebook_access?: string,
    language?: Languages,
}
