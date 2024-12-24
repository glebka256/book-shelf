export interface FilterOptions {
    genre: string[],
    language: string[]
}

export interface FilterQuery {
    subjects: string[],
    languages: string[],
    downloadable: boolean,
    readable: boolean
}
