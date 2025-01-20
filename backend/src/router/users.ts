import { Router } from 'express';

import { 
    getAllUsers, 
    deleteUser, 
    getAllFavorites, 
    toggleFavorite,
    updateFavorites
} from '@app/controllers/users';
import { isAccountOwner, isAuthenticated } from '@app/middlewares';

export default (router: Router): void => {
    router.get('/users/', isAuthenticated, getAllUsers);
    router.delete('/users/:id', isAuthenticated, isAccountOwner, deleteUser);
    router.get('/users/favorites/', isAuthenticated, getAllFavorites);
    router.put('/users/favorites/', isAuthenticated, toggleFavorite);
    router.post('/users/favorites/', isAuthenticated, updateFavorites)
}
