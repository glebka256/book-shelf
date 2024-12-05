import express from "express";

import authentication from "@app/router/authentication";
import users from "@app/router/users";

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);

    return router;
}
