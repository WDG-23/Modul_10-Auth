import { Router } from 'express';
import { createOne, getAll, getOne, updateOne, deleteOne } from '../controllers/crud.js';
import Book from '../models/Book.js';
import { getAllBooks } from '../controllers/book.controllers.js';

const bookRouter = Router();

bookRouter.post('/', createOne(Book));
bookRouter.get('/', getAllBooks);
bookRouter.get('/:id', getOne(Book));
bookRouter.put('/:id', updateOne(Book));
bookRouter.delete('/:id', deleteOne(Book));

export default bookRouter;
