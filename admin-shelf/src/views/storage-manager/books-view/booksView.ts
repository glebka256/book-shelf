import baseInstance from "@/config/axios"
import { BookData } from "@/types/Book.types"

export const fetchBooks = async (page: number, limit: number): Promise<BookData[]> => {
    const response = await baseInstance.get(
        `/books/paginated/${page}/${limit}`
    );
    console.log(response);

    return response.data.books;
}

export const fetchSortedBooks = async (
    page: number, 
    limit: number, 
    sortBy: string, 
    order: 'asc' | 'desc'
): Promise<BookData[]> => {
    const response = await baseInstance.post(
        `/books/sorted/${page}/${limit}`,
        {
            sortBy: sortBy,
            order: order
        }
    );
    return response.data.books;
}