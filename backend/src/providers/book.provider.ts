import axios from "axios";

interface GoodreadsAuthor {
    id: string,
    name: string
};

interface GoodreadsBook {
    bookId: string,
    title: string,
    workID: string,
    imageUrl: string,
    bookUrl: string,
    author: GoodreadsAuthor[],
    rank: number,
    rating: number,
    publishedYear: string
};

interface GoodreadsBooksData {
    books: GoodreadsBook[],
    totalResults: number,
    currentPage: number,
}

const mapGoodReadsAuthor = (authorData: any[]): GoodreadsAuthor[] => {
    return authorData.map((author) => ({
        id: author.id,
        name: author.name
    }));
}

const mapGoodreadsBooks = (rawData: any[]): GoodreadsBook[] => {
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

const validGoodreadsResponseData = (response: axios.AxiosResponse): boolean => {
    return Array.isArray(response.data.books) && response.data.books.length > 0;
}

export const fetchBooksGoodreads = async (searchQuery: string, pageNumber: number): Promise<GoodreadsBooksData> => {
    if (!searchQuery || pageNumber < 1) {
        throw new Error('Invalid query for fetchBooksGoodreads');
    }
    
    const options = {
        method: 'GET',
        url: `${process.env.GOODREADS_BASE_URL}/searchBooks`,
        params: {
            keyword: searchQuery,
            page: pageNumber
        },
        headers: {
            'x-rapidapi-key': process.env.GOODREAD_API_KEY,
            'x-rapidapi-host': process.env.GOODREAD_API_HOST
        }
    };

    let resultData: GoodreadsBooksData = {
        books: [],
        totalResults: 0,
        currentPage: 0
    }

    try {
        const response = await axios.request<GoodreadsBooksData>(options);

        if (!validGoodreadsResponseData(response)) {
            throw new Error('Invalid goodreads api response');
        }

        resultData = {
            books: mapGoodreadsBooks(response.data.books),
            totalResults: response.data.totalResults || response.data.books.length,
            currentPage: pageNumber
        }
    } catch (error) {
        console.log(`No books found for query: '${searchQuery}' on Goodreads`);
    }

    return resultData;
}
