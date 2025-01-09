import { Request, Response } from "express";
import bookManager from "@app/config/book-manager";
import { BookSources } from "@app/interfaces/Books";
import { Languages } from "@app/interfaces/Util";

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
