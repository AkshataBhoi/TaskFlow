import activityService from '../services/ActivityService.js';

export const getActivities = async (req, res, next) => {
  try {
    const { page, limit, search, date, type } = req.query;
    
    const result = await activityService.getUserActivities(req.user._id, {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
      search,
      date,
      type
    });

    res.status(200).json({
      success: true,
      message: 'Activities retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (error) {
    next(error);
  }
};
