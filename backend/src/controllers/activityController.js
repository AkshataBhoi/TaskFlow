import activityService from '../services/ActivityService.js';

export const getActivities = async (req, res, next) => {
  try {
    const activities = await activityService.getUserActivities(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Activities retrieved successfully',
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};
