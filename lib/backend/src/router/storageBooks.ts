import { Router } from 'express';

import * as controller from "@app/controllers/books/storageBooks";
import { validatePagination, validateSortRequest } from '@app/middlewares/validation';

export default (router: Router): void => {
    router.get('/books/', controller.getAllBooks);
    router.get('/books/sorted/options', controller.getSortOptions);
    router.get('/books/paginated/:page/:limit', validatePagination, controller.getPaginatedBooks);
    router.post('/books/sorted/:page/:limit', validatePagination, validateSortRequest, controller.getSortedBooks);
    router.get('/books/:id', controller.getBook);
    router.post('/books/', controller.createNewBook);
    router.put('/books/:id', controller.updateBook);
    router.delete('/books/:id', controller.deleteBook);
    router.post('/books/batch', controller.retrieveByIds);
}