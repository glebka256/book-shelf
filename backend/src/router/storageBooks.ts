import { Router } from 'express';

import { 
    createNewBook,
    deleteBook,
    getAllBooks,
    getBook, 
    getFiltered, 
    getFilterOptions, 
    getGeneralPopular, 
    lookupBookDetails, 
    updateBook
} from '@app/controllers/books';

export default (router: Router): void => {
    router.get('/books/', getAllBooks);
    router.get('/books/:id', getBook);
    router.post('/books/', createNewBook);
    router.put('/books/:id', updateBook);
    router.delete('/books/:id', deleteBook);
    router.get('/books/popular/:page/:limit?', getGeneralPopular);
    router.get('/books/detailed/:id', lookupBookDetails);
    router.get('/books/filter/options', getFilterOptions);
    router.post('/books/filter/', getFiltered);
}
