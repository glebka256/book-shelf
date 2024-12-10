export const convertObjectToArray = (obj: any):Array<any> => {
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
