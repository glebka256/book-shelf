import { Request, Response } from "express";
import { ClientBook } from "@app/interfaces/Books";
import { Languages } from "@app/interfaces/Util";
import { RecommendService } from "@app/services/RecommendService";
import bookManager from "@app/config/book-manager";
import { BookFilter } from "@app/services/BookFilter";
import { FilterQuery, FilterStatus } from "@app/interfaces/Filter";
import { searchByQuery } from "@app/services/BookSearch";

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

        const pageSize = 50;
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

export const searchBook = async (req: Request, res: Response): Promise<void> => {
    const query = req.params.query;
    const page = Number(req.params.page);
    const pageSize = 50;

    if (!query || isNaN(page)) {
        res.status(400).json({ message: "Search query and page number are required." });
        return;
    }

    const books = await searchByQuery(query, (page-1) * pageSize, pageSize);

    // Search status is used to inform server if all results have been fetched.
    // In such case client can prevent making unnecessary repetative requests.
    const searchStatus = books.length < page * pageSize ? true : false;

    if (!books) {
        res.status(400).json({ message: `Could not search book by query: ${query}` });
    } else {
        res.status(200).json({ searchComplete: searchStatus, books: books });
    }
}
