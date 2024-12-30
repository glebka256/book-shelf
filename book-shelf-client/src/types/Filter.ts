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

export interface FilterSelectorInstance {
    selectedValue: string
}

export interface FilterFormInstance {
    selectedOptions: FilterQuery;
    resetOptions: () => void;
    submitOptions: () => void;
}

export enum AcessOptions {
    All = 'All',
    Downloadable = 'Only downloadable',
    Readable = 'Only readable'
}
