import taskService from '../services/TaskService.js';

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: task,
    });
  } catch (error) {
    if (error.message === 'Task not found') {
      res.status(404);
    }
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user._id, req.body);
    console.log("===== CREATE TASK =====");
  console.log("BODY:", req.body);
  console.log("USER:", req.user);
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.user._id, req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    if (error.message === 'Task not found') {
      res.status(404);
    }
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await taskService.deleteTask(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task,
    });
  } catch (error) {
    if (error.message === 'Task not found') {
      res.status(404);
    }
    next(error);
  }
};
