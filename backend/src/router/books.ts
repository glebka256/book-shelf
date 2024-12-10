import { Router } from 'express';

import { 
    createNewBook,
    deleteBook,
    getAllBooks,
    getAnnasArchiveBooks, 
    getBestBooksByGenre, 
    getBook, 
    getGoodreadsBooks, 
    getOpenLibraryBooks, 
    searchBestBookById, 
    updateBook
} from '@app/controllers/books';

export default (router: Router): void => {
    router.get('/books/', getAllBooks);
    router.get('/books/:id', getBook);
    router.post('/books/', createNewBook);
    router.put('/books/:id', updateBook);
    router.delete('/books/:id', deleteBook);
    router.get('/books/goodreads/:query/:page', getGoodreadsBooks);
    router.get('/books/annas/:query/:author/:cat', getAnnasArchiveBooks);
    router.get('/books/best/all/:genre', getBestBooksByGenre);
    router.get('/books/best/:id', searchBestBookById);
    router.get('/books/open-lib/:q/:author/:cat/:acess/:lang', getOpenLibraryBooks);
}
