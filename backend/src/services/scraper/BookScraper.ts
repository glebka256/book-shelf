import bookManager from "@app/config/book-manager";
import { BooksData, BookSources, StorageBook } from "@app/interfaces/Books";
import { getBookByTitle, createBook } from "@app/models/book";

export class BookScraper {
    async populateWithTopOfGenre(genres: string[]): Promise<number> {
        let totalSaved: number = 0;

        const searchQuery = {
            subject: genres.join('&')
        }

        try {
            const bookData: BooksData = await bookManager.fetchBooks(BookSources.OpenLibrary, searchQuery);

            if (bookData.totalResults === 0) {
                console.error(`No data returned from Open Library with this query: ${searchQuery}`);
            }

            const books = this.mapAsStorageBooks(bookData.books);

            for (const book of books) {
                const bookSaved = await this.saveBookIfNotExists(book);
                totalSaved += bookSaved;
            }

        return totalSaved;
        } catch (error) {
            console.error("Could not populate database with data from Open Library.");
            console.error(`Query: ${searchQuery} Error: `, error);
            return totalSaved;
        }
    }

    async saveBookIfNotExists(book: StorageBook): Promise<number> {
        const existingBook = await getBookByTitle(book.title);

        if (existingBook) {
            return 0;
        }

        createBook(book);
        return 1;
    }

    mapAsStorageBooks(rawBooks: any[]): StorageBook[] {
        return rawBooks.map((book) => ({
            meta: {
                isbn: book.isbn,
                idGutenberg: book.idGutenberg,
                idGoodreads: book.idGoodreads,
                idAnnasArchive: ["unknown"],
                idAmazon: book.idAmazon
            },
            title: book.title,
            author: book.author,
            subject: book.subject,
            rating: book.ratingSortable,
            publishedYear: parseInt(book.publishYear),
            language: book.language,
            ebookAccess: book.ebookAcess
        }));
    }
}
