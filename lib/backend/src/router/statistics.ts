import { Router } from 'express';
import * as statController from "@app/controllers/statistics";

export default (router: Router): void => {
    router.get('/stats/books/total/', statController.getTotalBooks);
    router.get('/stats/books/subjects/total/', statController.getTotalSubjects);
    router.get('/stats/books/authors/total/', statController.getTotalAuthors);
    router.get('/stats/users/total/', statController.getTotalUsers);
    router.get('/stats/users/activity/', statController.getUserActivityStats);
}