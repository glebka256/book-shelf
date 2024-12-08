import { BooksData, BookSources } from "@app/interfaces/Books";
import { IBookServiceAdapter } from "./adapters/IBookServiceAdapter";

export class BookManager {
    private adapters: IBookServiceAdapter[];

    constructor() {
        this.adapters = [];
    }

    registerAdapter(adapter: IBookServiceAdapter): void {
        this.adapters.push(adapter);
    }
}
