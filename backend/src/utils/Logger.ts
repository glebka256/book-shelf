export class Logger {
    private static isEnabled = false;

    static enable() {
        this.isEnabled = true;
    }

    static disable() {
        this.isEnabled = false;
    }

    static log(...args: any[]){
        if (this.isEnabled) {
            console.log(...args);
        }
    }
}
