import { Request, Response } from "express";
import { BookSources, ClientBook } from "@app/interfaces/Books";
import { Languages } from "@app/interfaces/Util";
import { RecommendService } from "@app/services/RecommendService";
import bookManager from "@app/config/book-manager";
import { 
    createBook, 
    deleteBookById, 
    getBookById, 
    getBooks, 
    updateBookById 
} from "@app/models/book";
import { BookFilter } from "@app/services/BookFilter";
import { FilterQuery, FilterStatus } from "@app/interfaces/Filter";
import { Logger } from "@app/utils/Logger";

export const getBook = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    
    try {
        const searchedBook = await getBookById(id);
        res.status(200).json(searchedBook);
    } catch (error) {
        const errorMessage = `Could not get book with specified id.`;
        console.error(`${errorMessage}: `, error);
        res.status(400).json({ message: `${errorMessage}.` });
    }
}

export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const books = await getBooks();

        res.status(200).json(books);
    } catch (error) {
        const errorMessage = "Could not retrieve books";
        console.error(`${errorMessage}: `, error);
        res.status(400).json({ message: `${errorMessage}.` });
    }
}

export const createNewBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookData = req.body;

        const newBook = await createBook(bookData);
        res.status(201).json(newBook);
    } catch (error) {
        const errorMessage = "Could not create new book";
        console.error(`${errorMessage}: `, error);
        res.status(400).json({ message: `${errorMessage}.` });
    }
}

export const updateBook = async (req: Request, res: Response): Promise<void> => {   
    try {
        const bookData = req.body;
        const bookId = req.params.id;

        const updatedBook = await updateBookById(bookId, bookData);
        res.status(201).json(updatedBook);
    } catch (error) {
        const errorMessage = "Could not update book with specified id";
        console.error(`${errorMessage}: `, error);
        res.status(400).json({ message: `${errorMessage}.` });
    }
}

export const deleteBook = async (req: Request, res: Response): Promise<void> => {    
    try {
        const id = req.params.id;

        const deletedBook = await deleteBookById(id);
        res.status(201).json(deletedBook);
    } catch (error) {
        const errorMessage = "Could not update book with specified id";
        console.error(`${errorMessage}: `, error);
        res.status(400).json({ message: `${errorMessage}.` });
    }
}

export const getGeneralPopular = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.params.page);
        const limit = req.params.limit ? parseInt(req.params.limit) : 50;

        const defaultRecommend = new RecommendService(); 
        const popularBooks = await defaultRecommend.getPopularBooks(page, limit);
        res.status(200).json(popularBooks);
    } catch (error) {
        const errorMessage = "Could not get most popular books of all subjects.";
        console.error(`${errorMessage}: `, error);
        res.status(400).json({ message: `${errorMessage}.` });
    }
}

export const getFilterOptions = async (req: Request, res: Response): Promise<void> => {
    try {
        const filters = BookFilter.submitOptions();
        res.status(200).json(filters);
    } catch (error) {
        const errorMessage = "Could not submit filtering options.";
        console.error(`${errorMessage} Error: `, error);
        res.sendStatus(500);
    }
}

export const getFiltered = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = req.body.query as FilterQuery;
        const endPage = parseInt(req.body.page);
        const beginPage = endPage - 1;

        const pageSize = 20;
        const filtered = await BookFilter.getBooks(query, pageSize * endPage);

        if (filtered.status === FilterStatus.Hard || filtered.status === FilterStatus.Soft) {
            filtered.books = filtered.books.slice(beginPage * pageSize, endPage * pageSize);
            
            res.status(200).json(filtered)
            return;
        }
        
        const recommendation = new RecommendService();

        if (query.languages.length > 0) {
            recommendation.updatePreferedLanguages(query.languages as Languages[]);
        }

        const retrieved = filtered.books.length;
        const recommendationLimit = pageSize - retrieved;

        const popularBooks = await recommendation.getPopularBooks(endPage, recommendationLimit);

        filtered.books = filtered.books.slice(beginPage * pageSize, endPage * pageSize);
        filtered.books = filtered.books.concat(popularBooks as ClientBook[]);
        filtered.status = FilterStatus.Extend;

        res.status(200).json(filtered)
    } catch (error) {
        const errorMessage = "Could not filter books by query provided in requst body."
        console.error(errorMessage, `Error: ${error}`);
        res.status(400).json({ message: errorMessage });
    }
}

export const lookupBookDetails = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        const book: ClientBook = await bookManager.lookupBook(id);
        res.status(200).json(book);
    } catch (error) {
        const errorMessage = `Could not lookup book details by: ${id}.`;
        console.error(`${errorMessage} Error: `, error);
        res.status(400).json({ message: `${errorMessage}.` });
    }
}

export const getGoodreadsBooks = async (req: Request, res: Response): Promise<void> => {
    const searchQuery = req.params.query;
    const pageNumber = parseInt(req.params.page);

    if (!searchQuery || pageNumber < 1) {
        res.status(400).json({ message: "Search query and fetch result page number are required." });
        return;
    }

    try {
        const goodreadsBookData = await bookManager.fetchBooks(BookSources.Goodreads, searchQuery, pageNumber);
        
        res.status(200).json(goodreadsBookData.books);
        return;
    } catch (error) {
        res.status(400).json({ message: "Could not fetch books from Goodreads." });
        return;
    }
}

export const getAnnasArchiveBooks = async (req: Request, res: Response): Promise<void> => {
    const params = {
        query: req.params.query,
        author: req.params.author,
        category: req.params.cat
    }

    if (!params.query) {
        res.status(400).json({ message: "Search query is required for Anna's Archive search." });
        return;
    }

    try {
        const result = await bookManager.fetchBooks(BookSources.AnnasArchive, params);
        res.status(200).json(result.books);
    } catch (error) {
        res.status(400).json({ message: "Could not fetch books from Anna's Archive."})
        return;
    }
}

export const getBestBooksByGenre = async (req: Request, res: Response): Promise<void> => {
    const genre = req.params.genre;

    if (!genre) {
        res.status(400).json({ message: "Genre to get best books by must be provided." });
        return;
    }

    try {
        const bestBooksData = await bookManager.fetchBooks(BookSources.GoodreadsBooks, genre);
        res.status(200).json(bestBooksData.books);
        return;
    } catch (error) {
        res.status(400).json({ message: "Could not fetch best books by genre." });
        return;
    }
}

export const searchBestBookById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    if (!id) {
        res.status(400).json({ message: "Id to search by was not recieved." });
        return;
    }

    try {
        const bestBookdata = await bookManager.searchBookById(BookSources.GoodreadsBooks, id);
        res.status(200).json(bestBookdata);
        return;
    } catch (error) {
        res.status(400).json({ message: `Could not find best book by specified id: ${id}.` });
        return;
    }
}

export const getOpenLibraryBooks = async (req: Request, res: Response): Promise<void> => {
    const params = {
        q: req.params.q !== 'none' ? req.params.q : undefined,
        author: req.params.author !== 'none' ? req.params.author : undefined,
        subject: req.params.cat !== 'none' ? req.params.cat : undefined,
        ebook_access: req.params.access === "public" ? true : false,
        language: req.params.lang !== 'none' ? req.params.lang as Languages : undefined
    }

    try {
        const bookData = await bookManager.fetchBooks(BookSources.OpenLibrary, params);

        res.status(200).json(bookData);
        return;
    } catch (error) {
        res.status(400).json({ message: `Could not fetch books from Open Library with specified params.` });
        return;
    }
}

export const getAllGutenbergBooks = async (req: Request, res: Response): Promise<void> => {
    const params = { page: req.params.page || 1 }

    try {
        const bookData = await bookManager.fetchBooks(BookSources.ProjectGutenberg, params);
        res.status(200).json(bookData);
    } catch (error) {
        res.status(400).json({ message: `Could not fetch books from Project Gutenberg.` });
    }
}

export const getGutenbergBook = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    try {
        const book = await bookManager.searchBookById(BookSources.ProjectGutenberg, id);
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ message: `Could not get book from Project Gutenberg with specified id: ${id}` });
    }
}
