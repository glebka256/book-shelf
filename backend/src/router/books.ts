import { Router } from 'express';

import { getBooks } from '@app/controllers/books';

export default (router: Router): void => {
    router.get('/books/:query/:page', getBooks);
}