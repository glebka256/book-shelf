interface BookSize {
    value: number;
    metric: 'KB' | 'MB' | 'GB';
}

export interface BookLink {
    size: BookSize;
    readUrl: string;
    downloadUrl: string;
    format: string;
    buyUrl: string;
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