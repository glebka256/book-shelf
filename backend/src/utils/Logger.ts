import { getTimeStamp } from "@app/utils";

// Copied from https://github.com/GlebKarpenko/e-comm/
export class Logger {
    private static debugMode = false;

    static enableDebug() {
        this.debugMode = true;
    }

    static disableDebug() {
        this.debugMode = false;
    }

    static info(message: string, namespace?: string, object?: any) {
        const namespaceText = namespace ? `[${namespace}]` : '';

        if (object) {
            console.info(`[${getTimeStamp()}] [INFO] ${namespaceText} ${message}`, object);
        } else {
            console.info(`[${getTimeStamp()}] [INFO] ${namespaceText} ${message}`);
        }
    }

    static warn(message: string, namespace?: string, object?: any) {
        const namespaceText = namespace ? `[${namespace}]` : '';

        if (object) {
            console.warn(`[${getTimeStamp()}] [WARN] ${namespaceText} ${message}`, object);
        } else {
            console.warn(`[${getTimeStamp()}] [WARN] ${namespaceText} ${message}`);
        }
    }

    static error(message: string, namespace?: string, object?: any) {
        const namespaceText = namespace ? `[${namespace}]` : '';

        if (object) {
            console.warn(`[${getTimeStamp()}] [ERROR] ${namespaceText} ${message}`, object);
        } else {
            console.warn(`[${getTimeStamp()}] [ERROR] ${namespaceText} ${message}`);
        }
    }

    static debug(message: string, namespace?: string, object?: any) {
        if (this.debugMode) {
            const namespaceText = namespace ? `[${namespace}]` : '';

            if (object) {
                console.warn(`[${getTimeStamp()}] [DEBUG] ${namespaceText} ${message}`, object);
            } else {
                console.warn(`[${getTimeStamp()}] [DEBUG] ${namespaceText} ${message}`);
            }
        }
    }
}