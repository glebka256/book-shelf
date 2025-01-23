import { isAxiosError } from "axios";

export enum BasicErrors {
    Server = 'An error occured on the server.',
    Network = 'Network error: Unable to connect to the server',
    Unexpected = 'An unexpected error occured.',
    Request = 'Network error: Could not make server request.'
}

export const getResponseError = (error: unknown): string => {
    let message: string;

    if (isAxiosError(error)) {
        if (error.response && error.response.data) {
            message = error.response.data.message || BasicErrors.Server;
        } else if (!error.response) {
            message = BasicErrors.Network;
        } 
        else {
            message = error.message || BasicErrors.Unexpected;
        }
    } else {
        message = BasicErrors.Request;
    }

    return message;
}

export const isBasicError = (error: string): boolean => {
    return Object.values(BasicErrors).includes(error as BasicErrors);
}

export const replaceBasicError = (error: unknown, fallback: string): string => {
    const responseError = getResponseError(error);

    return isBasicError(responseError) ? fallback : responseError;
}

export const serviceError = (service: string): string => {
    return `Invalid ${service} service response data.`;
}
