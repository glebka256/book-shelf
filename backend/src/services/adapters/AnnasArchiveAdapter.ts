import { AxiosInstance, AxiosResponse } from "axios";
import { Logger } from "@app/utils/Logger";
import { IBookServiceAdapter, ADAPTER_NAMESPACE } from "./IBookServiceAdapter";
import { annasArchiveClient } from "../apiClients";
import { BooksData, BookSources, AnnasArchiveBook, DownloadInfo } from "@app/interfaces/Books";
import { splitFileSize } from "@app/utils";
import { FileSizeMetric } from "@app/interfaces/Util";

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

        try {
            const response = await this.apiClient.request(options);

            if (!this.validFetchResponse)
                throw new Error("Invalid Anna\'s Archive API response");

            const totalResults = response.data.total

            return {
                src: BookSources.AnnasArchive,
                books: this.mapData(response.data.books),
                totalResults: totalResults || response.data.length,
                currentPage: totalResults / 10
            }
        } catch (error) {
            Logger.error("Could not fetch books from Anna's Archive", ADAPTER_NAMESPACE, error);
            return null;
        }
    }

    async getDownloadsForTitle(title: string, language='en', limit=5): Promise<DownloadInfo>{
        const params = {
            q: title,
            lang: language,
            limit: limit
        }

        const searchResults = await this.fetchBooks(params);

        if (searchResults === null || searchResults.books.length) {
            return {
                urls: [],
                format: null,
                size: {
                    value: 0,
                    metric: FileSizeMetric.Bytes
                }
            }
        }

        const downloadUrls: string[] = [];
        const books = searchResults.books as AnnasArchiveBook[];

        for (let i = 0; i < Math.min(limit, books.length); i++ ) {
            const result = await this.fetchDownloadURL(books[i].md5);

            downloadUrls.push(...result);
        }

        const fileSize = splitFileSize(books[0].size);

        return {
            urls: downloadUrls,
            format: books[0].format,
            size: {
                value: fileSize.value,
                metric: fileSize.metric
            }
        };
    }

    async fetchDownloadURL(md5: string): Promise<string[]> {
        const options = {
            method: 'GET',
            url: '/download',
            params: md5
        }

        try {
            const response = await this.apiClient.request(options);

            if (!response.data)
                throw new Error("Missing Anna\'s Archive API response data");

            return response.data;
        } catch (error) {
            console.error(`Could not get download for md5: ${md5}.`, error);
            return [];
        }
    }

    getQueryParams(params: any): Object {
        const query: AnnasArchiveQuery = {
            q: params.query,
            author: params.author || '',
            cat: params.category || '',
            skip: params.skip || 0,
            limit: this.getQueryLimit(params.limit),
            ext: params.fileExtension || '',
            sort: 'mostRelevant',
            lang: params.language || 'en',
            source: params.source || 'libgenLi, libgenRs'
        }

        return query;
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
            md5: book.md5,
            size: book.size,
            genre: book.genre,
            format: book.format,
            year: book.year
        }));
    }
}

interface AnnasArchiveQuery {
    q: string,
    author?: string,
    cat?: string,
    skip?: number,
    limit?: number,
    ext?: string,
    sort?: string,
    lang?: string,
    source?: string
}
