import { Request, Response } from "express";
import { AnnasArchiveAdapter } from "@app/services/adapters/AnnasArchiveAdapter";
import { GoodreadsAdapter } from "@app/services/adapters/GoodreadsAdapter";

export const getGoodreadsBooks = async (req: Request, res: Response): Promise<void> => {
    const searchQuery = req.params.query;
    const pageNumber = parseInt(req.params.page);

    if (!searchQuery || pageNumber < 1) {
        res.status(400).json({ message: "Search query and fetch result page number are required." });
        return;
    }

    try {
        const adapter = new GoodreadsAdapter();
        const goodreadsBookData = await adapter.fetchBooks(searchQuery, pageNumber);
        
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
        const adapter = new AnnasArchiveAdapter();
        const result = await adapter.fetchBooks(params);
        res.status(200).json(result.books);
    } catch (error) {
        res.status(400).json({ message: "Could not fetch books from Anna's Archive."})
        return;
    }
}
