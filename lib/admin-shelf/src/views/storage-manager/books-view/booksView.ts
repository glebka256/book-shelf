import baseInstance from "@/config/axios"
import { BooksResponseData } from "./booksView.types";

export const getBooks = async (page: number, limit: number): Promise<BooksResponseData> => {
    const response = await baseInstance.get<BooksResponseData>(
        `/books/paginated/${page}/${limit}`
    );
    console.log(response);

    return response.data;
}

export const getSortedBooks = async (
    page: number, 
    limit: number, 
    sortBy: string, 
    order: 'asc' | 'desc'
): Promise<BooksResponseData> => {
    const response = await baseInstance.post<BooksResponseData>(
        `/books/sorted/${page}/${limit}`,
        {
            sortBy: sortBy,
            order: order
        }
    );
    return response.data;
}