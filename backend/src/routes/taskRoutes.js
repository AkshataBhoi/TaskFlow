import express from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { taskValidator } from '../validators/taskValidator.js';

const router = express.Router();

router.use(protect); // All task routes are protected

router.route('/')
  .get(getTasks)
  .post(taskValidator, validate, createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default router;
