import { Request, Response } from "express";
import { 
    createBook, 
    deleteBookById, 
    getBookById, 
    getBooks, 
    updateBookById 
} from "@app/models/book";

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
