import { Router } from 'express';
import { getAllBooks } from '../controllers/book.controllers.js';
import { createOne, deleteOne, getOne, updateOne } from '../controllers/crud.js';
import authenticate from '../middlewares/authenticate.js';
import hasRole from '../middlewares/hasRole.js';
import Book from '../models/Book.js';

const bookRouter = Router();

bookRouter.post('/', authenticate, createOne(Book));
bookRouter.get('/', getAllBooks);
bookRouter.get('/:id', authenticate, hasRole('reader'), getOne(Book));
bookRouter.put('/:id', authenticate, updateOne(Book));
bookRouter.delete('/:id', authenticate, deleteOne(Book));

export default bookRouter;
