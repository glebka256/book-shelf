import { AxiosResponse } from "axios";
import { AnnasArchiveBook, AnnasArchiveQuery, GoodreadsAuthor, GoodreadsBook } from "@app/interfaces/Books";

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

export const validAnnasResponseData = (response: AxiosResponse): boolean => {
    return response.data.books && Array.isArray(response.data.books);
}

const getQueryLimit = (expectedResultsNumber: number): number => {
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

export const getAnnasArchiveParams = (query: AnnasArchiveQuery): Object => {
    return {
        q: query.query,
        author: query.author || '',
        cat: query.category || '',
        skip: query.skip || 0,
        limit: getQueryLimit(query.limit),
        ext: query.fileExtension || '',
        sort: 'mostRelevant',
        lang: query.language || 'english',
        source: query.source || 'libgenLi, libgenRs'
    };
}

export const mapAnnasArchiveBooks = (rawData: any[]): AnnasArchiveBook[] => {
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
