import baseInstance from "@/config/axios";
import { FetchDataFunction } from "./sourcesManager.types";

export const fetchGoodreadsData: FetchDataFunction = async (formValues) => {
    const response = await baseInstance.get(
        `/books/goodreads
            /${formValues['query']}
            /${formValues['page']??null}`
    );
    return response.data;
};

export const fetchAnnasArchiveData: FetchDataFunction = async (formValues) => {
    const response = await baseInstance.get(
        `/books/annas
            /${formValues['query']}
            /${formValues['author']??null}
            /${formValues['cat']??null}`
    );
    return response.data;
};

export const fetchBestBooksData: FetchDataFunction = async (formValues) => {
    const response = await baseInstance.get(`/books/best/all/${formValues['genre']}`);
    return response.data;
};

export const fetchBestBooksdetailedData: FetchDataFunction = async (formValues) => {
    const response = await baseInstance.get(`/books/best/${formValues['id']}`);
    return response.data;
};

export const fetchOpenLibData: FetchDataFunction = async (formValues) => {
    const response = await baseInstance.get(
        `/books/open-lib
            /${formValues['q']}
            /${formValues['author']??null}
            /${formValues['cat']??null}
            /${formValues['access']??null}
            /${formValues['lang']??null}`
    );
    return response.data;
};

export const fetchGutenbergData: FetchDataFunction = async (formValues) => {
    const response = await baseInstance.get(`/books/gutenberg/all/${formValues['page']}`);
    return response.data;
};

export const fetchGutenbergDetailedData: FetchDataFunction = async (formValues) => {
    const response = await baseInstance.get(`/books/gutenberg/${formValues['id']}`);
    return response.data;
};