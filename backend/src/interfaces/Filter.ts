import { StorageBook } from "./Books"
import { SubjectGenre } from "./Data"

export interface FilterOptions {
    genre: SubjectGenre[],
    language: string[],
    downloadable: string,
    readable: string
}

export interface FilterQuery {
    subjects: string[],
    languages: string[],
    downloadable: boolean,
    readable: boolean
}

export interface ArrayEntryQuery {
    $in: string[]
}

export interface AccessabilityQuery {
    $exists: boolean,
    $ne: string | null
}

export interface HardQuery {
    'language': ArrayEntryQuery,
    'link.downloadUrl': AccessabilityQuery,
    'link.readUrl': AccessabilityQuery,
}

export enum FilterStatus {
    Empty = 401,
    Hard = 101,
    Soft = 102,
    Extend = 103
}

export interface FilterResult {
    status: FilterStatus,
    books: StorageBook[]
}
