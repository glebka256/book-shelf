import { Router } from 'express';

import * as auth from '@app/controllers/authentication';

export default (router: Router): void => {
    router.post('/auth/register', auth.register);
    router.post('/auth/login', auth.login);
    router.post('/auth/logout', auth.logout);
    router.get('/auth/user', auth.getUserInfo);
    router.get('/auth/user/id', auth.getUserId);
    router.delete('/auth/user', auth.deleteUser);
}