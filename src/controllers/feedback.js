import httpStatus from 'http-status';
import Feedback from '../models/feedbacks';

export const createFeedbackController = async (req, res, next) => {
  const { _id } = req.user;
  const { title, content, type } = req.body;
  const feedbackData = { userId: _id, title, content, type };
  try {
    const feedback = await Feedback.createFeedback(feedbackData);
    res.status(httpStatus.CREATED).json(feedback);
  } catch (error) {
    next(error);
  }
};
export const feedbackDetailController = async (req, res, next) => {
  const { feedbackId } = req.params;
  try {
    const feedback = await Feedback.getFeedbackById(feedbackId);
    res.status(httpStatus.OK).json(feedback);
  } catch (error) {
    next(error);
  }
};
export const filterFeedbackController = async (req, res, next) => {
  const { userRole, sortOrder, sortBy, type, searchQuery, page, limit } =
    req.query;
  const filter = {
    userRole,
    sortOrder,
    sortBy,
    searchQuery,
    type,
    page,
    limit,
  };
  try {
    const feedbacks = await Feedback.filterFeedback(filter);
    res.status(httpStatus.OK).json(feedbacks);
  } catch (error) {
    next(error);
  }
};
export const deleteFeedbackController = async (req, res, next) => {
  const { feedbackId } = req.params;
  try {
    const feedback = await Feedback.deleteFeedback(feedbackId);
    res.status(httpStatus.OK).json(feedback);
  } catch (error) {
    next(error);
  }
};
export const updateFeedbackController = async (req, res, next) => {
  const { feedbackId } = req.params;
  const { title, content, type } = req.body;
  const feedbackData = { title, content, type };
  try {
    const feedback = await Feedback.updateFeedback(feedbackId, feedbackData);
    res.status(httpStatus.OK).json(feedback);
  } catch (error) {
    next(error);
  }
};
