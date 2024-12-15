import { ClientBook } from "@app/interfaces/Books";
import { addBookClientProperty, linkExists, getBookById } from "@app/models/book";
import bookManager from "@app/config/book-manager";

export class BookLookup {
    async lookupBook(id: string): Promise<ClientBook> {
        const book = await getBookById(id);

        if (linkExists(id) && book.link.complete) {
            return this.mapBookforClient(book);
        }

        const resultBook = this.formatBookDetails(id);
        await this.extendBookData(resultBook);

        return resultBook;
    }

    async formatBookDetails(id: string): Promise<ClientBook> {
        const book = await getBookById(id);

        const download = await bookManager.getDownloads(book.title);
        if (download.urls.length !== 0) {
            book.link.download = {
                downloadUrl: download.urls[0],
                format: download.format,
                size: download.size
            };
        }

        book.link.complete = false;

        return this.mapBookforClient(book);
    }

    async extendBookData(extendedBook: any): Promise<void>{
        const existingBook = await getBookById(extendedBook.id);

        if (!existingBook) {
            console.error(`Book with id ${extendedBook.id} does not exist.`);
            return;
        }

        const clientData = this.mapBookForStorage(extendedBook, extendedBook.complete);
        try {
            await addBookClientProperty(existingBook.id, clientData);
        } catch (error) {
            console.error(`Could not extend book with id: ${extendedBook.id}`);
        }
    }

    mapBookforClient(book: any): ClientBook {
        const link = book.link?.[0] || {};
        
        return {
            id: book._id.toString(),
            title: book.title,
            author: book.author,
            genre: book.genre,
            rating: book.rating,
            publishedYear: book.publishedYear,
            language: book.language || book.language[0],
            links: {
                coverUrl: link.coverUrl || book.coverUrl,
                readUrl: link.readUrl || "undefined",
                download: {
                    downloadUrl: link.download.downloadUrl || "undefined",
                    format: link.download.format || "undefined",
                    size: link.download.size || 0
                },
                buyUrl: link.buyUrl || "undefined"
            }
        };
    }

    mapBookForStorage(clientBook: ClientBook, complete: Boolean): Partial<any> {
        return {
            complete: complete,
            title: clientBook.title,
            author: clientBook.author,
            genre: clientBook.genre,
            rating: clientBook.rating,
            publishedYear: clientBook.publishedYear,
            language: clientBook.language,
            coverUrl: clientBook.links.coverUrl,
            readUrl: clientBook.links.readUrl,
            download: {
                downloadUrl: clientBook.links.download.downloadUrl,
                format: clientBook.links.download.format,
                size: clientBook.links.download.size,
            },
            buyUrl: clientBook.links.buyUrl,
        };
    }
}
