import { Router } from 'express';

import { getAnnasArchiveBooks, getGoodreadsBooks } from '@app/controllers/books';

export default (router: Router): void => {
    router.get('/goodreads-books/:query/:page', getGoodreadsBooks);
    router.get('/annas-books/:query/:author/:cat', getAnnasArchiveBooks);
}