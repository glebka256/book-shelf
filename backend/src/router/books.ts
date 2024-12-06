import { Router } from 'express';

import { getGoodreadsBooks } from '@app/controllers/books';

export default (router: Router): void => {
    router.get('/goodreads-books/:query/:page', getGoodreadsBooks);
}