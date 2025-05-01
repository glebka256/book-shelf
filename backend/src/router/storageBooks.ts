import { Router } from 'express';

import { 
    createNewBook,
    deleteBook,
    getAllBooks,
    getBook, 
    getPaginatedBooks, 
    retrieveByIds, 
    updateBook
} from '@app/controllers/books/storageBooks';

export default (router: Router): void => {
    router.get('/books/', getAllBooks);
    router.get('/books/paginated/:page/:limit', getPaginatedBooks)
    router.get('/books/:id', getBook);
    router.post('/books/', createNewBook);
    router.put('/books/:id', updateBook);
    router.delete('/books/:id', deleteBook);
    router.post('/books/batch', retrieveByIds);
}
