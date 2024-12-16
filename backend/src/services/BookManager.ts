import { BooksData, BookSources, DownloadInfo, ProjectGutenbergBook } from "@app/interfaces/Books";
import { IBookServiceAdapter } from "./adapters/IBookServiceAdapter";
import { AnnasArchiveAdapter } from "./adapters/AnnasArchiveAdapter";
import { GutenbergAdapter } from "./adapters/GutenbergAdapter";
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
    calculatePriority(resource: {uri: string, type: string}, desiredFormat: string): number {
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
