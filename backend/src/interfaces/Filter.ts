import { StorageBook } from "./Books"

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
    language: ArrayEntryQuery,
    link: {
        downloadUrl: AccessabilityQuery,
        readUrl: AccessabilityQuery
    }
}

export enum FilterStatus {
    Hard = 101,
    Soft = 102,
    Extend = 103
}

export interface FilterResult {
    status: FilterStatus,
    books: StorageBook[]
}
