import { AxiosInstance, AxiosResponse } from "axios";

import { BooksData } from "@app/interfaces/Books";

export const ADAPTER_NAMESPACE = "BOOK-API-ADAPTER";

export interface IBookServiceAdapter {
    apiClient: AxiosInstance;

    fetchBooks(query: string | Object, page?: number): Promise<BooksData>;

    validFetchResponse(response: AxiosResponse): boolean;

    mapData(rawData: any[]): any[];

    searchBookById?(id: string): Promise<any>;
}