import * as readline from 'readline';
import { StorageBook } from '@app/interfaces/Books';

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
