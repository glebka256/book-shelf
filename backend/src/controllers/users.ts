import { Request, Response } from 'express';

import { deleteUserById, getUsers } from '@app/models/user';

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(400);
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        return res.status(200).json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.status(400);
    }
}
