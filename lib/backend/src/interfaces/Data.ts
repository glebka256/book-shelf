export enum AssociateType {
    Fiction = 'fiction',
    NonFiction = 'non-fiction',
    SelfHelp = 'self-help'
}

export interface SubjectAssociates {
    subject: {
        name: string,
        type: AssociateType
        associations: string[]
    }
}

export enum ScrapingTypes {
    Main = 'main',
    Additional = 'additional',
    All = 'all'
}

export interface SubjectGenre {
    name: string,
    subjects: string[]
}
