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
