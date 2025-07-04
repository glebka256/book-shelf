import { BookLink, BooksData, BookSources, DownloadInfo, ProjectGutenbergBook } from "@app/interfaces/Books";
import { IBookServiceAdapter } from "./adapters/IBookServiceAdapter";
import { AnnasArchiveAdapter } from "./adapters/AnnasArchiveAdapter";
import { GutenbergAdapter } from "./adapters/GutenbergAdapter";
import { ClientBook, StorageBook } from "@app/interfaces/Books";
import { getBookById, addBookLinkProperty, updateBookCompleteStatus } from "@app/models/book";
import { FileSizeMetric } from "@app/interfaces/Util";
import { Logger } from "@book-shelf/gckit";

const NAMESPACE = "BOOK-MANAGER";

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

    /**
     * Looks up book details in the database. If some are missing, retrieves them from other sources like Project Gutenberg API.
     * After retrieving from other sources saves them to database.
     * @param id - local database book id.
     * @returns book with all details needed for client.
     */
    async lookupBook(id: string, desiredFormat='epub'): Promise<ClientBook> {
        const book = (await getBookById(id)) as StorageBook;

        if (!book) {
            return null;
        }

        if (this.containsAllLinks(book)) {
            book.complete = true;
            updateBookCompleteStatus(id, true);

            return book as ClientBook;
        }

        let detailedBook: StorageBook = book;

        const { link } = detailedBook;

        if (!link) {
            detailedBook.link = this.createEmptyLink();

            detailedBook = await this.getBookDownloads(detailedBook, desiredFormat);
            detailedBook = this.updateReadUrl(detailedBook);
            detailedBook = this.updateBuyUrl(detailedBook);

            await this.extendBookData(detailedBook);

            return detailedBook as ClientBook;
        }

        // Load by segments to reduce number of any third party requests.
        if (!link.downloadUrl) {
            detailedBook = await this.getBookDownloads(detailedBook, desiredFormat);
        }

        if (!link.readUrl) {
            detailedBook = this.updateReadUrl(detailedBook);
        }

        if (!link.buyUrl) {
            detailedBook = this.updateBuyUrl(detailedBook);
        }

        await this.extendBookData(detailedBook);

        return detailedBook as ClientBook;
    }

    private containsAllLinks(book: StorageBook): boolean {
        if (!book.link || typeof book.link !== 'object') {
            return false;
        }

        const requiredKeys: Array<keyof BookLink> = ['readUrl', 'downloadUrl', 'buyUrl', 'format'];

        for (const key of requiredKeys) {
            if (!book.link[key]) {
                return false;
            }
        }
        
        return true;
    }

    private createEmptyLink(): BookLink {
        return {
            readUrl: '',
            downloadUrl: '',
            buyUrl: '',
            format: '',
            size: {
                value: 0,
                metric: FileSizeMetric.Bytes
            }
        }
    }

    private async getBookDownloads(book: StorageBook, desiredFormat: string): Promise<StorageBook> {
        // Gutenberg downloads are of higher priority then Anna's Archive.
        if (book.meta.idGutenberg.length !== 0) {
            const gutenbergDown = await this.getGutenbergDownloads(book.meta.idGutenberg[0], desiredFormat);

            if (gutenbergDown != null && gutenbergDown.urls.length !== 0) {
                return this.updateBookDownloads(book, gutenbergDown);
            }
        }

        const annasDown = await this.getAnnasDownloads(book.title);

        if (annasDown !== null && annasDown.urls.length !== 0) {
            return this.updateBookDownloads(book, annasDown);
        }

        return book;
    }

    private updateReadUrl(book: StorageBook): StorageBook {
        const openLibraryPageUrl = `https://openlibrary.org/isbn/${book.meta.isbn}`;
        book.link.readUrl = openLibraryPageUrl;

        return book;
    }

    private updateBuyUrl(book: StorageBook): StorageBook {
        const amazonPageUrl = `https://www.amazon.com/dp/${book.meta.isbn}`;
        book.link.buyUrl = amazonPageUrl;

        return book;
    }

    private async extendBookData(book: StorageBook): Promise<void>{
        try {
            if (this.containsAllLinks(book)) {
                book.complete = true;
                await updateBookCompleteStatus(book.id, true);
            }

            await addBookLinkProperty(book.id, book.link);
        } catch (error) {
            Logger.error(`Could not extend book with id '${book.id}':`, NAMESPACE, error);
        }
    }

    private updateBookDownloads(book: StorageBook, downloadInfo: DownloadInfo): StorageBook {
        const newLink = {
            downloadUrl: downloadInfo.urls[0],
            format: downloadInfo.format || 'unknown',
            size: {
                value: downloadInfo.size.value || 0,
                metric: downloadInfo.size.metric || FileSizeMetric.Bytes
            },
        }

        book.link.downloadUrl = newLink.downloadUrl;
        book.link.format = newLink.format;
        book.link.size = newLink.size;

        return book;
    }

    async getAnnasDownloads(title: string): Promise<DownloadInfo> {
        const adapter = new AnnasArchiveAdapter();

        try {
            const downloads = await adapter.getDownloadsForTitle(title);

            if (!downloads || !downloads.urls || !downloads.urls.length) {
                return null
            }

            return downloads;
        } catch (error) {
            Logger.error("Error getting downloads by title from Annas's Archive: ", NAMESPACE, error);
            return null;
        }
    }

    /**
     * Retrieves download URIs from different resources tied to book with Gutenberg id.
     * Resources are sorted by desired format and to be most extensive (with images etc.)
     * @param id - book's Gutenberg id.
     * @param type - desired book format, if not found other formats are retrieved as well.
     * @returns - URIs with download information.
     */
    async getGutenbergDownloads(id: string, type: string): Promise<DownloadInfo> {
        const adapter = new GutenbergAdapter();
        const bookData: ProjectGutenbergBook = await adapter.searchBookById(id);

        if (bookData === null || !bookData.resources || !bookData.resources.length) {
            return null;
        }

        const resources = bookData.resources;

        // URI ending with 'images' means that it could be ebook download link, other URIs are not related to download.
        resources.filter((resource) => !resource.type.endsWith('images'));
        resources.sort((a, b) => {
            const priorityA = this.calculatePriority(a, type);
            const priorityB = this.calculatePriority(b, type);

            if (priorityA !== priorityB) {
                return priorityB - priorityA;
            }

            return a.type.localeCompare(b.type);
        });

        return {
            urls: resources.map((resource) => resource.uri),
            format: type,
            size: {
                value: 0.5,
                metric: FileSizeMetric.Megabytes
            }
        }
    }

    /**
     * Calculates priority for sorting resources based on required criterias.
     * @param resource - resource object recieved from Gutenberg API.
     * @param desiredFormat - desired ebook download format as MIME type, for ex. 'epub' or 'mobi'.
     * @returns - calculated priority number, higher number means better resource.
     */
    private calculatePriority(resource: {uri: string, type: string}, desiredFormat: string): number {
        const containsImagesPriority = resource.uri.endsWith('images') ? 2 : 0;

        let desiredType = '';
        let optionalType = '';

        if (desiredFormat === 'epub') {
            desiredType = 'epub+zip';
            optionalType = 'x-mobipocket-ebook'
        } else if (desiredFormat === 'mobi') {
            desiredType = 'x-mobipocket-ebook';
            optionalType = 'epub+zip';
        }

        let formatPriority = 0;

        if (resource.type.includes(desiredType)) {
            formatPriority = 3;
        } else if (resource.type.includes(optionalType)) {
            formatPriority = 2;
        }

        return containsImagesPriority + formatPriority;
    }
}