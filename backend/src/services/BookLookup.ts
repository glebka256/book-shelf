import { ClientBook, StorageBook } from "@app/interfaces/Books";
import { addBookLinkProperty, linkExists, getBookById } from "@app/models/book";
import bookManager from "@app/config/book-manager";
import { FileSizeMetric } from "@app/interfaces/Util";

export class BookLookup {
    async lookupBook(id: string): Promise<ClientBook> {
        const book = await getBookById(id);

        if (linkExists(id) && book.link.complete) {
            return this.mapBookforClient(book as StorageBook);
        }

        const resultBook = await this.formatBookDetails(id);
        await this.extendBookData(resultBook);

        return resultBook;
    }

    async formatBookDetails(id: string): Promise<ClientBook> {
        const book = (await getBookById(id)) as StorageBook;
        const desiredFormat = 'epub';

        const download = await bookManager.getGutenbergDownloads(book.title, desiredFormat);
        if (download.urls.length !== 0) {
            book.link.downloadUrl = download.urls[0],
            book.link.format = download.format || desiredFormat,
            book.link.size.value = download.size.value || 0,
            book.link.size.metric = download.size.metric || FileSizeMetric.Bytes
        }

        book.link.complete = false;

        return this.mapBookforClient(book);
    }

    async extendBookData(extendedBook: ClientBook): Promise<void>{
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

    mapBookforClient(book: StorageBook): ClientBook {        
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

    mapBookForStorage(book: ClientBook): Partial<Record<string, any>> {
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
}
