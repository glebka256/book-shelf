import { Request, Response } from 'express';

import { deleteUserById, getUsers } from '@app/models/user';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsers();

        res.status(200).json(users);
        return;
    } catch (error) {
        console.log(error);
        res.status(400);
        return;
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        res.status(200).json(deletedUser);
        return;
    } catch (error) {
        console.log(error);
        res.status(400);
        return;
    }
}
