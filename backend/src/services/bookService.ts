import { AxiosResponse } from "axios";
import { GoodreadsAuthor, GoodreadsBook } from "@app/interfaces/Goodreads";

export const mapGoodReadsAuthor = (authorData: any[]): GoodreadsAuthor[] => {
    return authorData.map((author) => ({
        id: author.id,
        name: author.name
    }));
}

export const mapGoodreadsBooks = (rawData: any[]): GoodreadsBook[] => {
    return rawData.map((book) => ({
        bookId: book.bookId,
        title: book.title,
        workID: book.workID,
        imageUrl: book.imageUrl,
        bookUrl: book.bookUrl,
        author: mapGoodReadsAuthor(book.author),
        rank: parseInt(book.rank),
        rating: parseFloat(book.rating),
        publishedYear: book.publishedYear
    }));
}

export const validGoodreadsResponseData = (response: AxiosResponse): boolean => {
    return response.data && Array.isArray(response.data);
}
