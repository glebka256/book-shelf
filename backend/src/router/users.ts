import { Router } from 'express';

import { getAllUsers, deleteUser } from '@app/controllers/users';
import { isAccountOwner, isAuthenticated } from '@app/middlewares';

export default (router: Router): void => {
    router.get('/users/', isAuthenticated, getAllUsers);
    router.post('/users/:id', isAuthenticated, isAccountOwner, deleteUser);
}
