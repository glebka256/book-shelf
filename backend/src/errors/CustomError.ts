export class CustomError extends Error {
    readonly code: number;
    readonly message: string;
    readonly namespace: string;
    readonly logging: boolean;

    constructor (
        code: number,
        message: string,
        logging: boolean,
        namespace: string
    ) {
        super(message);
        this.code = code;
        this.logging = logging;
        this.message = message;
        this.namespace = namespace;

        // Need this because of extending built in class
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}