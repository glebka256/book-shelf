import { createControllerHandler } from "../controllerHandler";
import { CustomError } from "@app/errors/CustomError";
import mongoose from "mongoose";
import * as bookModel from "@app/models/book";
import { ClientBook } from "@app/interfaces/Books";
import { SortableField, SortQuery } from "@app/interfaces/Sort";

const NAMESPACE = "STORAGE-BOOK-REQUEST";
const controllerHandler = createControllerHandler(NAMESPACE);

export const getBook = controllerHandler(async (req, res) => {
    const bookId = req.params.id;
    if (!bookId) throw new CustomError(400, "Request missing id parameter", false, NAMESPACE);
    
    const searchedBook = await bookModel.getBookById(bookId);
    if (!searchedBook) throw new CustomError(404, `Book with id: ${bookId} not found`, false, NAMESPACE);
    res.status(200).json(searchedBook);
});

export const getAllBooks = controllerHandler(async (req, res) => {
    const books = await bookModel.getBooks();
    res.status(200).json(books);
});

export const getPaginatedBooks = controllerHandler(async (req, res) => {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);    
    const totalItems = await bookModel.getTotalEntries();
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages)
        throw new CustomError(400, "Page number is higher then there are pages in total", false, NAMESPACE); 

    const books = await bookModel.queryPaginated(page, limit);

    res.status(200).json({
        currentPage: page,
        totalPages: totalPages,
        totalBooks: totalItems,
        books: books
    });
});

export const getSortedBooks = controllerHandler(async (req, res) => {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    const totalItems = await bookModel.getTotalEntries();
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages)
        throw new CustomError(400, "Page number is higher then there are pages in total", false, NAMESPACE); 

    const sortBy = req.body.sortBy as SortableField;
    const orderDirection = req.body.order;
    const order = orderDirection === 'asc' ? 1 : -1;
    const sortQuery: SortQuery = { sortBy, order, limit, page };

    const books = await bookModel.sortBooks(sortQuery);
    res.status(200).json({
        currentPage: page,
        totalPages: totalPages,
        totalBooks: totalItems,
        books: books
    });
});

export const createNewBook = controllerHandler(async (req, res) => {
    const bookData = req.body;
    if (!bookData) throw new CustomError(400, "Request body missing bookData field", false, NAMESPACE);

    // Catch validation errors to return 400 on incorrect request body
    try {
        const newBook = await bookModel.createBook(bookData);
        res.status(201).json(newBook);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            throw new CustomError(400, "Validation failed while creating book: " + error, false, NAMESPACE);
        } else {
            throw error;
        }
    }
});

export const updateBook = controllerHandler(async (req, res) => {   
    const bookId = req.params.id;
    if (!bookId) throw new CustomError(400, "Request missing bookId parameter", false, NAMESPACE);

    const bookData = req.body;
    if (!bookData) throw new CustomError(400, "Request body missing bookData field", false, NAMESPACE);

    // Catch validation errors to return 400 on incorrect request body
    try {
        const updatedBook = await bookModel.updateBookById(bookId, bookData);
        res.status(201).json(updatedBook);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            throw new CustomError(400, "Validation failed while updating book: " + error, false, NAMESPACE);
        } else {
            throw error;
        }
    }
});

export const deleteBook = controllerHandler(async (req, res) => {    
    const bookId = req.params.id;
    if (!bookId) throw new CustomError(400, "Request missing bookId parameter", false, NAMESPACE);

    const deletedBook = await bookModel.deleteBookById(bookId);
    if (!deleteBook) throw new CustomError(404, "Book with specified id not found", false, NAMESPACE);

    res.status(201).json(deletedBook);
});

export const retrieveByIds = controllerHandler(async (req, res) => {
    const { bookIds } = req.body;

    if (!Array.isArray(bookIds) || bookIds.length === 0)
        throw new CustomError(400, "Missing bookIds array in request body", false, NAMESPACE);

    const books = await bookModel.queryBooks({ _id: { $in: bookIds } });

    res.status(200).json(books as ClientBook[]);
});