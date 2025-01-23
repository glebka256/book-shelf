import { FetchResponse, Book } from "@/types/Book";
import baseInstance from "./baseInstance"
import { getResponseError } from "./main";

export const getBooksByIds = async (ids: string[]): Promise<FetchResponse> => {
    try {
        const response = await baseInstance.post<Book[]>(
            '/books/batch/', 
            { bookIds: ids }
        );

        return {
            success: true,
            message: "Retrieved User's favorites.",
            data: response.data
        }
    } catch (error) {
        return {
            success: false,
            message: getResponseError(error),
            data: []
        }
    }
}
