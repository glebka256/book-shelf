import { Router } from 'express';

import { 
    register, 
    login, 
    logout, 
    getUserInfo
} from '@app/controllers/authentication';

export default (router: Router): void => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.post('/auth/logout', logout);
    router.get('/auth/user', getUserInfo);
}
