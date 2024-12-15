import { BooksData, BookSources, ClientBook } from "@app/interfaces/Books";
import { IBookServiceAdapter } from "./adapters/IBookServiceAdapter";
import { addBookClientProperty, getBookById } from "@app/models/book";

export class BookManager {
    private adapters: Map<BookSources, IBookServiceAdapter>;

    constructor() {
        this.adapters = new Map();
    }

    registerAdapter(source: BookSources, adapter: IBookServiceAdapter): void {
        this.adapters.set(source, adapter);
    }

    async fetchBooks(source: BookSources, query: Object, page?: number): Promise<BooksData> {
        const adapter = this.adapters.get(source);

        if (!adapter) {
            throw new Error(`No adapter registered for source: ${source}`);
        }

        return adapter.fetchBooks(query, page);
    }

    async searchBookById(source: BookSources, id: string): Promise<any> {
        const adapter = this.adapters.get(source);

        if (!adapter || !adapter.searchBookById) {
            throw new Error(`No adapter with search option registered for source: ${source}`);
        }

        return adapter.searchBookById(id);
    }

    async extendBookData(extendedBook: ClientBook): Promise<void>{
        const existingBook = await getBookById(extendedBook.id);

        if (!existingBook) {
            console.error(`Book with id ${extendedBook.id} does not exist.`);
            return;
        }

        const { id, ...extendedBookWithoutId } = extendedBook;
        try {
            await addBookClientProperty(existingBook.id, extendedBookWithoutId);
        } catch (error) {
            console.error(`Could not extend book with id: ${id}`);
        }
    }
}
