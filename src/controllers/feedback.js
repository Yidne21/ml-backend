import httpStatus from 'http-status';
import Feedback from '../models/feedbacks';

export const createFeedbackController = async (req, res, next) => {
  const userId = req.user;
  const { title, content } = req.body;
  const feedbackData = { userId, title, content };
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
  const { userRole, createdAt, title, userEmail, userName } = req.query;
  const filter = { userRole, createdAt, title, userEmail, userName };
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
  const { title, content } = req.body;
  const feedbackData = { title, content };
  try {
    const feedback = await Feedback.updateFeedback(feedbackId, feedbackData);
    res.status(httpStatus.OK).json(feedback);
  } catch (error) {
    next(error);
  }
};
