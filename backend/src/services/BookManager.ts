import { BooksData, BookSources, DownloadInfo, ProjectGutenbergBook } from "@app/interfaces/Books";
import { IBookServiceAdapter } from "./adapters/IBookServiceAdapter";
import { AnnasArchiveAdapter } from "./adapters/AnnasArchiveAdapter";
import { GutenbergAdapter } from "./adapters/GutenbergAdapter";
import { ClientBook, StorageBook } from "@app/interfaces/Books";
import { linkExists, getBookById, addBookLinkProperty } from "@app/models/book";
import { FileSizeMetric } from "@app/interfaces/Util";

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
    async lookupBook(id: string): Promise<ClientBook> {
        const book = await getBookById(id);

        if (linkExists(id) && book.link.complete) {
            return this.mapBookforClient(book as StorageBook);
        }

        const resultBook = await this.formatBookDetails(id);
        await this.extendBookData(resultBook);

        return resultBook;
    }

    private async formatBookDetails(id: string): Promise<ClientBook> {
        const book = (await getBookById(id)) as StorageBook;
        const desiredFormat = 'epub';

        const download = await this.getGutenbergDownloads(book.title, desiredFormat);
        if (download.urls.length !== 0) {
            book.link.downloadUrl = download.urls[0],
            book.link.format = download.format || desiredFormat,
            book.link.size.value = download.size.value || 0,
            book.link.size.metric = download.size.metric || FileSizeMetric.Bytes
        }

        book.link.complete = false;

        return this.mapBookforClient(book);
    }

    private async extendBookData(extendedBook: ClientBook): Promise<void>{
        const existingBook = (await getBookById(extendedBook.id)) as StorageBook;

        if (!existingBook) {
            console.error(`Book with id ${extendedBook.id} does not exist.`);
            return;
        }

        const linkData = this.mapBookForStorage(extendedBook);
        try {
            await addBookLinkProperty(existingBook.id, linkData);
        } catch (error) {
            console.error(`Could not extend book with id: ${extendedBook.id}`);
        }
    }

    private mapBookforClient(book: StorageBook): ClientBook {        
        return {
            id: book.id,
            title: book.title,
            author: book.author,
            genre: book.subject,
            rating: book.rating,
            publishedYear: book.publishedYear,
            language: book.language,
            link: {
                coverUrl: book.coverUrl,
                readUrl: book.link.readUrl,
                downloadUrl: book.link.downloadUrl,
                format: book.link.format,
                size: {
                    value: book.link.size.value,
                    metric: book.link.size.metric
                },
                buyUrl: book.link.buyUrl
            }
        };
    }

    private mapBookForStorage(book: ClientBook): Partial<Record<string, any>> {
        return {
            readUrl: book.link.readUrl,
            downloadUrl: book.link.downloadUrl,
            format: book.link.format,
            size: {
                value: book.link.size.value,
                metric: book.link.size.metric
            },
            buyUrl: book.link.buyUrl,
        };
    }

    async getAnnasDownloads(title: string): Promise<DownloadInfo> {
        const adapter = new AnnasArchiveAdapter();
        return adapter.getDownloadsForTitle(title);
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
