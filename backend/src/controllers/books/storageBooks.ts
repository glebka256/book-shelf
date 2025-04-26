import { createControllerHandler } from "../controllerHandler";
import { CustomError } from "@app/errors/CustomError";
import { 
    createBook, 
    deleteBookById, 
    getBookById, 
    getBooks, 
    updateBookById ,
    queryBooks
} from "@app/models/book";
import { ClientBook } from "@app/interfaces/Books";

const NAMESPACE = "STORAGE-BOOK-REQUEST";
const controllerHandler = createControllerHandler(NAMESPACE);

export const getBook = controllerHandler(async (req, res) => {
    const bookId = req.params.id;
    if (!bookId) throw new CustomError(400, "Request missing id parameter", false, NAMESPACE);
    
    const searchedBook = await getBookById(bookId);
    if (!searchedBook) throw new CustomError(404, `Book with id: ${bookId} not found`, false, NAMESPACE);
    res.status(200).json(searchedBook);
});

export const getAllBooks = controllerHandler(async (req, res) => {
    const books = await getBooks();
    res.status(200).json(books);
});

export const createNewBook = controllerHandler(async (req, res) => {
    const bookData = req.body;
    if (!bookData) throw new CustomError(400, "Request body missing bookData field", false, NAMESPACE);

    const newBook = await createBook(bookData);
    res.status(201).json(newBook);
});

export const updateBook = controllerHandler(async (req, res) => {   
    const bookId = req.params.id;
    if (!bookId) throw new CustomError(400, "Request missing bookId parameter", false, NAMESPACE);

    const bookData = req.body;
    if (!bookData) throw new CustomError(400, "Request body missing bookData field", false, NAMESPACE);

    const updatedBook = await updateBookById(bookId, bookData);
    res.status(201).json(updatedBook);
});

export const deleteBook = controllerHandler(async (req, res) => {    
    const bookId = req.params.id;
    if (!bookId) throw new CustomError(400, "Request missing bookId parameter", false, NAMESPACE);

    const deletedBook = await deleteBookById(bookId);
    if (!deleteBook) throw new CustomError(404, "Book with specified id not found", false, NAMESPACE);

    res.status(201).json(deletedBook);
});

export const retrieveByIds = controllerHandler(async (req, res) => {
    const { bookIds } = req.body;

    if (!Array.isArray(bookIds) || bookIds.length === 0)
        throw new CustomError(400, "Missing bookIds array in request body", false, NAMESPACE);

    const books = await queryBooks({ _id: { $in: bookIds } });

    res.status(200).json(books as ClientBook[]);
});