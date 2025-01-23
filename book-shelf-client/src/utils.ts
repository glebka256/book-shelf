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

export const trimSlash = (text: string): string => {
    return text.replace(/^\/|\/$/g, '');
}
