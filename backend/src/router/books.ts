import { Router } from 'express';

import { 
    getFiltered, 
    getFilterOptions, 
    getGeneralPopular, 
    lookupBookDetails, 
    searchBook, 
} from '@app/controllers/books/books';

export default (router: Router): void => {
    router.get('/books/popular/:page/:limit?', getGeneralPopular);
    router.get('/books/detailed/:id', lookupBookDetails);
    router.get('/books/search/:query/:page', searchBook);
    router.get('/books/filter/options', getFilterOptions);
    router.post('/books/filter/', getFiltered);
}
