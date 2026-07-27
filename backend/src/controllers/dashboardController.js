import dashboardService from '../services/DashboardService.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardData(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getStatistics = async (req, res, next) => {
  try {
    const statistics = await dashboardService.getStatistics(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: statistics,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const activity = await dashboardService.getRecentActivity(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Recent activity retrieved successfully',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};
