export interface BookLink {
    size: {
        value: number;
        metric: string;
    };
    readUrl: string;
    downloadUrl: string;
    format: string;
    buyUrl: string;
    _id: string;
}

export interface BookData {
    _id: string;
    coverUrl: string;
    title: string;
    author: string[];
    subject: string[];
    rating: number;
    publishedYear: number;
    language: string[];
    ebookAccess: boolean;
    complete: boolean;
    link?: BookLink;
}