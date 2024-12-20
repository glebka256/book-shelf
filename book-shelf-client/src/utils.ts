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
