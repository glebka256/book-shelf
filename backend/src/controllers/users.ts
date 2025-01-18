import { Request, Response } from 'express';
import { get } from 'lodash';
import { deleteUserById, getUsers, getUserWithFavoritesById } from '@app/models/user';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsers();

        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(400);
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        res.status(200).json(deletedUser);
    } catch (error) {
        console.log(error);
        res.status(400);
    }
}

export const getAllFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = get(req, 'identity._id') as string;
        const populatedUser = await getUserWithFavoritesById(userId);

        if (!populatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ favorites: populatedUser.favorites });
    } catch (error) {
        console.error("Error retrieving favorite books for user: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/** Adds or removes bookId from favorites based on it's presence given user and bookId. */
export const updateFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = get(req, 'identity._id') as string;
        const { bookId } = req.body;

        if (!bookId) {
            res.status(400).json({ message: "Book ID is required" });
            return;
        }

        const populatedUser = await getUserWithFavoritesById(userId);

        if (!populatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (populatedUser.favorites.includes(bookId)) {
            populatedUser.favorites = populatedUser.favorites.filter(id => id.toString() !== bookId);
        } else {
            populatedUser.favorites.push(bookId);
        }

        await populatedUser.save();

        res.status(200).json({ favorites: populatedUser.favorites });
    } catch (error) {
        console.error("Error updating favorite book for user. Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
