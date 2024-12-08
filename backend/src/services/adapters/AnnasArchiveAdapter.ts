import { AxiosInstance, AxiosResponse } from "axios";
import { IBookServiceAdapter } from "./IBookServiceAdapter";
import { annasArchiveClient } from "../apiClients";
import { BooksData, BookSources, AnnasArchiveBook } from "@app/interfaces/Books";

export class AnnasArchiveAdapter implements IBookServiceAdapter {
    apiClient: AxiosInstance;

    constructor() {
        this.apiClient = annasArchiveClient;
    }

    async fetchBooks(query: Object, page?: number): Promise<BooksData> {
        const params = this.getQueryParams(query);

        const options = {
            method: 'GET',
            url: `/search`,
            params: params
        };

        const response = await this.apiClient.request(options);

        if (!this.validFetchResponse) {
            throw new Error("Invalid Anna\'s Archive API response");
        }

        const totalResults = response.data.total

        return {
            src: BookSources.AnnasArchive,
            books: this.mapData(response.data.books),
            totalResults: totalResults || response.data.length,
            currentPage: totalResults / 10
        }
    }

    getQueryParams(params: any): Object {
        const query: AnnasArchiveQuery = {
            query: params.query,
            author: params.author,
            category: params.category
        }

        return {
            q: query.query,
            author: query.author || '',
            cat: query.category || '',
            skip: query.skip || 0,
            limit: this.getQueryLimit(query.limit),
            ext: query.fileExtension || '',
            sort: 'mostRelevant',
            lang: query.language || 'english',
            source: query.source || 'libgenLi, libgenRs'
        };
    }

    getQueryLimit = (expectedResultsNumber: number): number => {
        const min = 10;
        const max = 200;
    
        if (typeof expectedResultsNumber !== 'number' || expectedResultsNumber > max) {
            return max
        }
        if (expectedResultsNumber < min) {
            return min;
        }
        return expectedResultsNumber;
    }

    validFetchResponse(response: AxiosResponse): boolean {
        return response.data.books && Array.isArray(response.data.books);
    }

    mapData(rawData: any[]): AnnasArchiveBook[] {
        return rawData.map((book) => ({
            title: book.title,
            author: book.author,
            imgUrl: book.imgUrl,
            size: book.size,
            genre: book.genre,
            format: book.format,
            year: book.year
        }));
    }
}

interface AnnasArchiveQuery {
    query: string,
    author?: string,
    category?: string,
    skip?: number,
    limit?: number,
    fileExtension?: string,
    language?: string,
    source?: string
}
