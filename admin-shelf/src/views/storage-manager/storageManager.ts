import { BookFormDTO } from "./book-form/bookForm.types";
import baseInstance from "@/config/axios";
import * as bookFormService from "./book-form/bookForm";

const mapBookFormDTO = (data: any): Partial<BookFormDTO> => {
    return {
        title: data.title,
        author: data.author,
        subject: data.subject,
        publishedYear: data.publishedYear,
        language: data.language,
        ebookAccess: data.ebookAccess,
        meta: data.meta,
        coverUrl: data.coverUrl,
        rating: data.rating,
        link: data.link,
    }
}

export const populateFormById = async (id: string): Promise<BookFormDTO> => {
    const respone = await baseInstance.get(`/books/${id}`);
    try {
        const partialData: Partial<BookFormDTO> = mapBookFormDTO(respone.data);
        return bookFormService.formInitialBookState(partialData);
    } catch (error) {
        console.error("Invalid server data recieved to populate edit form");
        return bookFormService.emptyInitialForm;
    }
}