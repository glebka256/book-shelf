export const getTimeStamp = (): string => {
    return new Date().toISOString();
};

export const isISO8601 = (datetime: Date): boolean => {
    return !isNaN(datetime.getTime()) && (datetime.toISOString() !== undefined);
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