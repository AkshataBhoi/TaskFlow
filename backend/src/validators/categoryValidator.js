import { check } from 'express-validator';

export const categoryValidator = [
  check('name', 'Category name is required').notEmpty(),
];
