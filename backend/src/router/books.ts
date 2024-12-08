import { Router } from 'express';

import { getAnnasArchiveBooks, getBestBooksByGenre, getGoodreadsBooks } from '@app/controllers/books';

export default (router: Router): void => {
    router.get('/books/goodreads/:query/:page', getGoodreadsBooks);
    router.get('/books/annas/:query/:author/:cat', getAnnasArchiveBooks);
    router.get('/books/best/genre', getBestBooksByGenre);
}