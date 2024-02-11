import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';

export async function filterFeedback({
  userRole,
  createdAt,
  title,
  userEmail,
  userName,
  page = 1,
  limit = 10,
}) {
  const FeedbackModel = this.model(modelNames.feedback);
  const filter = {};
  if (userRole) filter.userRole = userRole;
  if (createdAt) filter.createdAt = createdAt;
  if (title) filter.title = title;
  if (userEmail) filter.userEmail = userEmail;
  if (userName) filter.userName = userName;

  const feedbacks = await FeedbackModel.find(filter)
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({ createdAt: -1 })
    .populate('userId', 'name email')
    .exec();

  return feedbacks;
}

export async function getFeedbackById(feedbackId) {
  const FeedbackModel = this.model(modelNames.feedback);
  const feedback = await FeedbackModel.findById(feedbackId);
  if (!feedback) {
    throw new APIError({
      message: 'Feedback not found',
      status: httpStatus.NOT_FOUND,
    });
  }
  return feedback;
}

export async function createFeedback(feedbackData) {
  const FeedbackModel = this.model(modelNames.feedback);
  const feedback = await FeedbackModel.create(feedbackData);
  return feedback;
}

export async function deleteFeedback(feedbackId) {
  const FeedbackModel = this.model(modelNames.feedback);
  const feedback = await FeedbackModel.findByIdAndDelete(feedbackId);
  if (!feedback) {
    throw new APIError({
      message: 'Feedback not found',
      status: httpStatus.NOT_FOUND,
    });
  }
  return feedback;
}

export async function updateFeedback(feedbackId, feedbackData) {
  const FeedbackModel = this.model(modelNames.feedback);
  const feedback = await FeedbackModel.findByIdAndUpdate(
    feedbackId,
    feedbackData,
    {
      new: true,
    }
  );
  if (!feedback) {
    throw new APIError({
      message: 'Feedback not found',
      status: httpStatus.NOT_FOUND,
    });
  }
  return feedback;
}
