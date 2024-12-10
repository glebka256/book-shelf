import { Router } from 'express';

import { 
    getAnnasArchiveBooks, 
    getBestBooksByGenre, 
    getGoodreadsBooks, 
    getOpenLibraryBooks, 
    searchBestBookById, 
} from '@app/controllers/books';

export default (router: Router): void => {
    router.get('/books/goodreads/:query/:page', getGoodreadsBooks);
    router.get('/books/annas/:query/:author/:cat', getAnnasArchiveBooks);
    router.get('/books/best/all/:genre', getBestBooksByGenre);
    router.get('/books/best/:id', searchBestBookById);
    router.get('/books/open-lib/:q/:author/:cat/:acess/:lang', getOpenLibraryBooks);
}
