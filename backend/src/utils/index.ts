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

export const dynamicLog = (staticMessage: string, dynamicMessage: string): void => {
    console.clear();
    console.log(staticMessage, dynamicMessage)
}
