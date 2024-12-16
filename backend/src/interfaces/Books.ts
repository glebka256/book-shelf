import { FileSizeMetric } from "./Util"

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
    md5: string,
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
    amazonLink: string,
    author: string
}

export interface OpenLibraryBook {
    isbn: string,
    title: string,
    coverId: string,
    idGutenberg: string[],
    idGoodreads: string[],
    idAmazon: string[],
    language: string[],
    publishYear: string,
    subject: string[],
    ratingAverage: number,
    ratingSortable: number,
    author: string[],
    ebookAcess: boolean,
}

export interface ProjectGutenbergBook {
    id: number,
    title: string,
    description: string,
    bookShelves: string[],
    languages: string[],
    resources: [{
        id: number,
        uri: string,
        type: string
    }],
}

export interface DownloadInfo {
    urls: string[],
    format: string,
    size: {
        value: number,
        metric: FileSizeMetric
    }
}

export interface ClientBook {
    id: string,
    title: string,
    author: string[],
    genre: string[],
    rating: number,
    publishedYear: number,
    language: string[],
    link: {
        coverUrl: string,
        readUrl: string,
        downloadUrl: string,
        format: string,
        size: {
            value: number,
            metric: FileSizeMetric
        }
        buyUrl: string,
    }
}

export interface StorageBook {
    id: string,
    meta: {
        isbn: string,
        idGutenberg: string[],
        idGoodreads: string[],
        idAnnasArchive: string[],
        idAmazon: string[]
    },
    coverUrl: string,
    title: string,
    author: string[],
    subject: string[],
    rating: number,
    publishedYear: number,
    language: string[],
    ebookAccess: boolean,
    link?: {
        complete: false,
        readUrl: string,
        downloadUrl: string,
        format: string,
        size: {
            value: number,
            metric: FileSizeMetric
        }
        buyUrl: string,
    }
}

export enum BookSources {
    Native = "Book Shelf",
    AnnasArchive = "Anna's Archive",
    Goodreads = "Goodreads",
    GoodreadsBooks = "Goodreads Books",
    OpenLibrary = "Open Library",
    ProjectGutenberg = "Project Gutenberg"
}

export enum Languages {
    English = "eng",
    French = "fre",
    Spanish = "spa",
    German = "ger"
}

export interface BooksData {
    src: string,
    books: AnnasArchiveBook[] | GoodreadsBook[] | BestBook[] | OpenLibraryBook[],
    totalResults: number,
    currentPage: number,
}
