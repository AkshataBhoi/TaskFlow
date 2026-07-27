import express from 'express';
import { getDashboardData, getStatistics, getRecentActivity } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getDashboardData);
router.get('/statistics', getStatistics);
router.get('/activity', getRecentActivity);

export default router;
