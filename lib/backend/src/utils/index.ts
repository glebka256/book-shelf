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

export const extractDocs = <T>(docs: any[]): T[] => {
    return docs.map((doc) => doc._doc as T);
}

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

export const sortNumericRecord = (
    record: Record<string, number>, 
    type: 'des' | 'asc' = 'des'
): Record<string, number> => {
    return Object.fromEntries(
        Object.entries(record).sort(([, a], [, b]) => 
            type === 'asc' ? a - b : b - a
        )
    );
}

export const sliceMap = (
    map: Map<string, string[]>, 
    slice: number
): Map<string, string[]> => {
    const slicedMap = new Map<string, string[]>();

    const iterator = map.entries();
    let count = 0;
    let next = iterator.next();

    while (!next.done && count < slice) {
        const [key, value] = next.value;
        slicedMap.set(key, value);
        count++;
        next = iterator.next();
    }

    return slicedMap;
}

// Copied from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffleArray = <T>(array: T[]): T[] => {
    // Return value not reference, dont modify original array
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}