import express from "express";

import authentication from "@app/router/authentication";
import users from "@app/router/users";
import books from "@app/router/books";

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    books(router);

    return router;
}
