import * as readline from 'readline';

/**
 * Handles interactive terminal loading animations and dynamic output
 */
export class TextLoader {
    private static readonly spinnerFrames = ['|', '/', '-', '\\'];
    private interval?: NodeJS.Timeout;
    private currentFrame = 0;
    private isRunning = false;
    
    constructor(
        private message: string,
        private delay: number = 100,
        private frames: string[] = TextLoader.spinnerFrames
    ) {}
    
    /**
     * Start the loading animation running
     */
    start(): void {
        if (this.isRunning) {
            return;
        }
        
        this.isRunning = true;
        this.currentFrame = 0;
        
        this.interval = setInterval(() => {
            process.stdout.write(`\r${this.message} ${this.frames[this.currentFrame]}`);
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }, this.delay);
    }
    
    /**
     * Stop the loading animation and clear the line
     */
    stop(): void {
        if (!this.isRunning) {
            return;
        }
        
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
        
        this.isRunning = false;
        this.clearLine();
    }
    
    /**
     * Update the message while running
     */
    updateMessage(newMessage: string): void {
        this.message = newMessage;
    }
    
    /**
     * Check if loader is currently running
     */
    isActive(): boolean {
        return this.isRunning;
    }
    
    /**
     * Clear the current line and move cursor to beginning
     */
    private clearLine(): void {
        if (process.stdout.isTTY) {
            readline.cursorTo(process.stdout, 0);
            readline.clearLine(process.stdout, 0);
        }
    }
    
    /**
     * Static utility methods for one-off operations
     */
    static clearLine(): void {
        if (process.stdout.isTTY) {
            readline.cursorTo(process.stdout, 0);
            readline.clearLine(process.stdout, 0);
        }
    }
    
    /**
     * Displays message with static and dynamic parts
     */
    static dynamicLog(staticMessage: string, dynamicMessage: string, overwrite: boolean = false): void {
        if (!process.stdout.isTTY) {
            console.warn("Dynamic logging is not supported in this environment!");
            return;
        }
        
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);
        
        if (overwrite) {
            process.stdout.write(staticMessage + dynamicMessage + '\n');
        } else {
            process.stdout.write(staticMessage + dynamicMessage);
        }
    }
    
    /**
     * Create a progress bar string
     */
    static progressBar(current: number, total: number, width: number = 40): string {
        const percentage = Math.round((current / total) * 100);
        const filled = Math.round((current / total) * width);
        const empty = width - filled;
        
        return `[${'█'.repeat(filled)}${' '.repeat(empty)}] ${percentage}%`;
    }
    
    /**
     * Create a loader with custom spinner frames
     */
    static withCustomFrames(message: string, frames: string[], delay: number = 100): TextLoader {
        return new TextLoader(message, delay, frames);
    }
}