import express from "express";

import authentication from "@app/router/authentication";
import users from "@app/router/users";
import storageBooks from "./storageBooks";
import externalBooks from "./externalBooks";

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    storageBooks(router);
    externalBooks(router);

    return router;
}
