import { createControllerHandler } from "../controllerHandler";
import { CustomError } from "@app/errors/CustomError";
import bookManager from "@app/config/book-manager";
import { BookSources } from "@app/interfaces/Books";
import { Languages } from "@app/interfaces/Util";
import { OpenLibraryAdapter } from "@app/services/adapters/OpenLibraryAdapter";

const NAMESPACE = "THIRD-PARTY-BOOK-REQUEST";
const controllerHandler = createControllerHandler(NAMESPACE);

export const getGoodreadsBooks = controllerHandler(async (req, res) => {
    const searchQuery = req.params.query;
    if (!searchQuery) throw new CustomError(400, "Search query missing from request parameters", false, NAMESPACE);

    const pageNumber = parseInt(req.params.page);
    if (pageNumber <= 1) throw new CustomError(400, "Page number missing from request parameters", false, NAMESPACE);

    const goodreadsBookData = await bookManager.fetchBooks(BookSources.Goodreads, searchQuery, pageNumber);
    res.status(200).json(goodreadsBookData.books);
});

export const getAnnasArchiveBooks = controllerHandler(async (req, res) => {
    const params = {
        query: req.params.query,
        author: req.params.author,
        category: req.params.cat
    }
    if (!params.query) throw new CustomError(400, "query param is required for AnnasArchive search", false, NAMESPACE);

    const result = await bookManager.fetchBooks(BookSources.AnnasArchive, params);
    res.status(200).json(result.books);
});

export const getBestBooksByGenre = controllerHandler(async (req, res) => {
    const genre = req.params.genre;
    if (!genre) throw new CustomError(400, 'genre param is required for "Best Books" API request', false, NAMESPACE);

    const bestBooksData = await bookManager.fetchBooks(BookSources.GoodreadsBooks, genre);
    res.status(200).json(bestBooksData.books);
});

export const searchBestBookById = controllerHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) throw new CustomError(400, 'Request missing id parameter for "Best Books" API', false, NAMESPACE);

    const bestBookdata = await bookManager.searchBookById(BookSources.GoodreadsBooks, id);
    res.status(200).json(bestBookdata);
});

export const getOpenLibraryBooks = controllerHandler(async (req, res) => {
    const params = {
        q: req.params.q !== 'none' ? req.params.q : undefined,
        author: req.params.author !== 'none' ? req.params.author : undefined,
        subject: req.params.cat !== 'none' ? req.params.cat : undefined,
        ebook_access: req.params.access === "public" ? true : false,
        language: req.params.lang !== 'none' ? req.params.lang as Languages : undefined
    }

    // Not using BookManager because strict mode needs to be disabled.
    // Sctrict mode needs to be disbled for client to see any JSON, including invalid
    const adapter = new OpenLibraryAdapter();
    adapter.strictMap = false;
    const bookData = await adapter.fetchBooks(params)
    res.status(200).json(bookData);
});

export const getAllGutenbergBooks = controllerHandler(async (req, res) => {
    const params = { page: req.params.page || 1 }

    const bookData = await bookManager.fetchBooks(BookSources.ProjectGutenberg, params);
    res.status(200).json(bookData);
});

export const getGutenbergBook = controllerHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) throw new CustomError(400, 'Request missing id parameter for "ProjectGutenberg" API', false, NAMESPACE);

    const book = await bookManager.searchBookById(BookSources.ProjectGutenberg, id);
    res.status(200).json(book);
});