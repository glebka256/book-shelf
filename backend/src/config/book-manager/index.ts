import { BookManager } from '@app/services/BookManager';
import { AnnasArchiveAdapter } from '@app/services/adapters/AnnasArchiveAdapter';
import { GoodreadsAdapter } from '@app/services/adapters/GoodreadsAdapter';
import { BestBooksAdapter } from '@app/services/adapters/BestBooksAdapter';
import { OpenLibraryAdapter } from '@app/services/adapters/OpenLibraryAdapter';
import { BookSources } from '@app/interfaces/Books';

export const configureBookManager = (): BookManager => {
    const bookManager = new BookManager();
    bookManager.registerAdapter(BookSources.AnnasArchive ,new AnnasArchiveAdapter());
    bookManager.registerAdapter(BookSources.Goodreads, new GoodreadsAdapter());
    bookManager.registerAdapter(BookSources.GoodreadsBooks, new BestBooksAdapter());
    bookManager.registerAdapter(BookSources.OpenLibrary, new OpenLibraryAdapter());
    return bookManager;
};
