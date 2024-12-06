export interface GoodreadsAuthor {
    id: string,
    name: string
};

export interface GoodreadsBook {
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

export interface AnnasArchiveBook {
    title: string,
    author: string,
    imgUrl: string,
    size: string,
    genre: string,
    format: string,
    year: string
}

export interface AnnasArchiveQuery {
    query: string,
    author?: string,
    category?: string,
    skip?: number,
    limit?: number,
    fileExtension?: string,
    language?: string,
    source?: string
}

export interface BooksData {
    books: GoodreadsBook[],
    totalResults: number,
    currentPage: number,
}
