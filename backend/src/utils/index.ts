import * as readline from 'readline';
import { StorageBook } from '@app/interfaces/Books';
import { FileSizeMetric } from '@app/interfaces/Util';

export const convertObjectToArrayWithIndices = (obj: any):Array<any> => {
    return Object.keys(obj).map((key) => [key, obj[key]]);
}

export const getUrlSearchParams = (query: Object):string  => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
        if (value) {
            params.append(key, value);
        }
    }

    return params.toString();
}

/**
 * Displays message with ascii loading animation next to it.
 */
export const dynamicLoader = (message: string, delay: number = 100) => {
    const spinnerFrames = ['|', '/', '-', '\\'];
    let currenFrame = 0;

    const interval = setInterval(() => {
        process.stdout.write(`\r${message} ${spinnerFrames[currenFrame]}`);
        currenFrame = (currenFrame + 1) % spinnerFrames.length;
    }, delay);

    return () => {
        clearInterval(interval);
        process.stdout.write('r');
    }
}

/**
 * Displays message with static and dynamic parts.
 */
export const dynamicLog = (() => {
    let lastLines: number = 0;

    return (staticMessage: string, dynamicMessage: string): void => {
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);

        process.stdout.write(`${staticMessage}${dynamicMessage}\n`);

        lastLines++;
    };
})();

export const extractBookFromDoc = (bookDoc: any[]): StorageBook[] => {
    return bookDoc.map((book) => book._doc as StorageBook);
}

/**
 * Splits string fileSize into value and metric. Defaults to bytes if no metric provided.
 * @param fileSize - combined string of value and metric
 * @returns - numeric size with it's metric as string 
 */
export const splitFileSize = (fileSize: string): { value: number, metric: FileSizeMetric } => {
    for (const metric of Object.values(FileSizeMetric)) {
        if (fileSize.endsWith(metric)) {
            const valueString = fileSize.replace(metric, '').trim();
            const value = parseFloat(valueString);
            return { value, metric };
        }
    }

    const value = parseFloat(fileSize.trim());
    return { value, metric: FileSizeMetric.Bytes };
}

export const toWhitespace = (words: string): string => {
    return words.replace(/_/g, ' ');
}

export const toUnderscore = (words: string) => {
    return words.replace(/ /g, '_');
}

export const setArrayWhitespace = (array: string[], type: 'whitespace' | 'underscore') => {
    if (type === 'whitespace') {
        return array.map((element) => toWhitespace(element));
    } else {
        return array.map((element) => toUnderscore(element));
    }
}
