export interface Book {
    _id: string,
    title: string,
    coverUrl: string,
    author: string[],
    subject: string[],
    rating: number,
    publishedYear: number,
    language: string[],
    ebookAccess: boolean,
    link: BookLink
}

export interface BookLink {
    readUrl: string,
    downloadUrl: string,
    format: string,
    size: {
        value: number,
        metric: string
    }
    buyUrl: string,
}

export interface FetchResponse {
    success: boolean,
    message: string,
    data: Book[]
}

export interface SearchResponse {
    searchComplete: boolean,
    data: Book[]
}

export const SearchMethods = {
    all: {
        title: 'Search Results',
        method: 'all',
        path: '/search'
    },
    downloadable: {
        title: 'Downloadable Results',
        method: 'downloadable',
        path: '/search/downloadable'
    }
} as const;

export type SearchMethod = typeof SearchMethods[keyof typeof SearchMethods];
