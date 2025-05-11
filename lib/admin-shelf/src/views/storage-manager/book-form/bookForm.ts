import baseInstance from "@/config/axios";
import { BookFormDTO } from "./bookForm.types";
import { BookData } from "@/types/Book.types";

/** Emtpy form values */
export const emptyInitialForm: BookFormDTO = {
    title: '',
    author: [],
    subject: [],
    publishedYear: new Date().getFullYear(),
    language: ['eng'],
    ebookAccess: false,
    meta: {
        isbn: '',
        idGutenberg: [],
        idGoodreads: [],
        idAnnasArchive: [],
        idAmazon: []
    },
    coverUrl: '',
    rating: 0,
    link: {
        size: {
            value: 0,
            metric: 'MB'
        },
        readUrl: '',
        downloadUrl: '',
        format: 'pdf',
        buyUrl: ''
    }
};

/** Selector options */
export const options = {
    sizeMetric: [
        { value: 'KB' },
        { value: 'MB' },
        { value: 'GB' }
    ],
    fileFormat: [
        { value: 'pdf', label: 'PDF' },
        { value: 'epub', label: 'EPUB' },
        { value: 'mobi', label: 'MOBI' },
        { value: 'azw3', label: 'AZW3' },
        { value: 'txt', label: 'TXT' }
    ],
}

export function formInitialBookState(
    partial: Partial<BookFormDTO>
): BookFormDTO {
    return {
        ...emptyInitialForm,
        ...partial,
        author: partial.author ?? emptyInitialForm.author,
        subject: partial.subject ?? emptyInitialForm.subject,
        language: partial.language ?? emptyInitialForm.language,
        meta: {
            ...emptyInitialForm.meta,
            ...partial.meta,
            idGutenberg: partial.meta?.idGutenberg ?? emptyInitialForm.meta.idGutenberg,
            idGoodreads: partial.meta?.idGoodreads ?? emptyInitialForm.meta.idGoodreads,
            idAnnasArchive: partial.meta?.idAnnasArchive ?? emptyInitialForm.meta.idAnnasArchive,
            idAmazon: partial.meta?.idAmazon ?? emptyInitialForm.meta.idAmazon,
        },
        link: {
            ...emptyInitialForm.link,
            ...partial.link,
            size: {
                ...emptyInitialForm.link.size,
                ...partial.link?.size,
            },
        },
    };
}

export const postBookEdit = async (id: string, data: BookFormDTO): Promise<boolean> => {
    const response = await baseInstance.put<BookData>(`/books/${id}`, data);
    return response.status === 201;
};

export const postNewBook = async (data: BookFormDTO): Promise<boolean> => {
    const response = await baseInstance.post<BookData>(`/books`, data);
    return response.status === 201;
}

export const deleteBook = async (id: string): Promise<boolean> => {
    const response = await baseInstance.delete<BookData>(`/books/${id}`);
    return response.status === 201;
}