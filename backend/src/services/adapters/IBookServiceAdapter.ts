import { AxiosInstance, AxiosResponse } from "axios";

import { BooksData } from "@app/interfaces/Books";

export interface IBookServiceAdapter {
    apiClient: AxiosInstance;

    fetchBooks(query: string, page?: number): Promise<BooksData>;

    validFetchResponse(response: AxiosResponse): boolean;

    mapData(rawData: any[]): any[];
}