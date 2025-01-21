import { isAxiosError } from "axios";

// pro hacker tool
export const calculateTextWidth = (text: string, fontSize: number, fontFamily='Arial'): number => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (context) {
        context.font = `${fontSize}px ${fontFamily}`;
        return context.measureText(text).width;
    }
    return 0;
}

export const mergeArrays = (array1: string[], array2: string[]) => {
    const mergedArray = new Set([...array1, ...array2]);
    return Array.from(mergedArray);
}

export const getResponseErrorMessage = (error: unknown): string => {
    let message: string;

    if (isAxiosError(error) && error.response && error.response.data) {
        const serverError = error.response.data;
        message = serverError.message || 'An error occured on the server.';
    } else if (isAxiosError(error)) {
        message = error.message || 'An unexpected error occured.';
    } else {
        message = 'An unexpected error occured.';
    }

    return message;
}
