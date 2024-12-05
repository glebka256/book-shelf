import { Router } from 'express';

import { register, login } from '@app/controllers/authentication';

export default (router: Router): void => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
}
