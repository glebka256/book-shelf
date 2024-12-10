import { Router } from 'express';

import { 
    createNewBook,
    deleteBook,
    getAllBooks,
    getBook, 
    updateBook
} from '@app/controllers/books';

export default (router: Router): void => {
    router.get('/books/', getAllBooks);
    router.get('/books/:id', getBook);
    router.post('/books/', createNewBook);
    router.put('/books/:id', updateBook);
    router.delete('/books/:id', deleteBook);
}
