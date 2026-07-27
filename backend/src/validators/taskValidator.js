import { check } from 'express-validator';

export const taskValidator = [
  check('title', 'Task title is required').notEmpty(),
  check('categoryId', 'Category ID is required').notEmpty(),
];
