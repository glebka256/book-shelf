export interface FilterGenre {
    name: string,
    subjects: string,
}

export interface FilterOptions {
    genre: FilterGenre[],
    language: string[]
}

export interface FilterQuery {
    subjects: string[],
    languages: string[],
    downloadable: boolean,
    readable: boolean
}
