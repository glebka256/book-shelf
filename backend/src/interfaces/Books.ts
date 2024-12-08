export interface GoodreadsBook {
    bookId: string,
    title: string,
    workID: string,
    imageUrl: string,
    bookUrl: string,
    author: string,
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

export interface BestBook {
    id: string,
    title: string,
    description: string,
    publicationDate: string,
    language: string,
    rating: number,
    imageUrl: number,
    genres: string[],
    amazonLink: string
}

export interface Book {
    id: string,
    title: string,
    author: string,
    genre: string,
    rating: number,
    publishedYear: number,
    language: string,
    links: {
        coverUrl: string,
        readUrl: string,
        download: {
            downloadUrl: string,
            format: string,
            size: string
        }
        buyUrl: string,
    }
}

export enum BookSources {
    Native = "Book Shelf",
    AnnasArchive = "Anna's Archive",
    Goodreads = "Goodreads",
    GoodreadsBooks = "Goodreads Books"
}

export interface BooksData {
    src: string,
    books: Book[] | AnnasArchiveBook[] | GoodreadsBook[],
    totalResults: number,
    currentPage: number,
}
