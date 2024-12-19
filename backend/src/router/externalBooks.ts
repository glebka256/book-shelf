import { Router } from 'express';

import { 
    getAllGutenbergBooks,
    getAnnasArchiveBooks, 
    getBestBooksByGenre, 
    getGoodreadsBooks, 
    getGutenbergBook, 
    getOpenLibraryBooks, 
    searchBestBookById, 
} from '@app/controllers/books';

export default (router: Router): void => {
    router.get('/books/goodreads/:query/:page', getGoodreadsBooks);
    router.get('/books/annas/:query/:author/:cat', getAnnasArchiveBooks);
    router.get('/books/best/all/:genre', getBestBooksByGenre);
    router.get('/books/best/:id', searchBestBookById);
    router.get('/books/open-lib/:q/:author/:cat/:access/:lang', getOpenLibraryBooks);
    router.get('/books/gutenberg/all/:page', getAllGutenbergBooks);
    router.get('/books/gutenberg/:id', getGutenbergBook);
}
