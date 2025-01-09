import express from "express";

import authentication from "@app/router/authentication";
import users from "@app/router/users";
import storageBooks from "./storageBooks";
import books from "./books";
import externalBooks from "./externalBooks";

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    storageBooks(router);
    books(router);
    externalBooks(router);

    return router;
}
