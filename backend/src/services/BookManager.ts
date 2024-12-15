import { BooksData, BookSources, DownloadInfo } from "@app/interfaces/Books";
import { IBookServiceAdapter } from "./adapters/IBookServiceAdapter";
import { AnnasArchiveAdapter } from "./adapters/AnnasArchiveAdapter";

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

    async getDownloads(title: string): Promise<DownloadInfo> {
        const adapter = new AnnasArchiveAdapter();
        return adapter.getDownloadsForTitle(title);
    }
}
