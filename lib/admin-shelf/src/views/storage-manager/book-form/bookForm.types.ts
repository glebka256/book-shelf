import { BookLink } from "@/types/Book.types";

interface BookMeta {
    isbn: string;
    idGutenberg: string[];
    idGoodreads: string[];
    idAnnasArchive: string[];
    idAmazon: string[];
}

export interface BookFormDTO {
    title: string;
    author: string[];
    subject: string[];
    publishedYear: number;
    language: string[];
    ebookAccess: boolean;
    meta: BookMeta;
    coverUrl: string;
    rating: number;
    link: BookLink;
}