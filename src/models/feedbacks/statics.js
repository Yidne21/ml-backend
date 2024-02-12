import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import { paginationPipeline } from '../../utils/index';

export async function filterFeedback({
  userRole,
  sortOrder,
  sortBy,
  title,
  userEmail,
  userName,
  page = 1,
  limit = 10,
}) {
  const FeedbackModel = this.model(modelNames.feedback);
  try {
    const feedbacks = await FeedbackModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          ...(userRole ? { 'user.role': userRole } : {}),
          ...(title ? { title: { $regex: new RegExp(title, 'i') } } : {}),
          ...(userEmail
            ? { 'user.email': { $regex: new RegExp(userEmail, 'i') } }
            : {}),
          ...(userName
            ? { 'user.name': { $regex: new RegExp(userName, 'i') } }
            : {}),
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          user: {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
          },
          createdAt: 1,
        },
      },
      {
        $sort: {
          [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1,
        },
      },
      ...paginationPipeline(page, limit),
    ]);

    return feedbacks[0];
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function getFeedbackById(feedbackId) {
  const FeedbackModel = this.model(modelNames.feedback);
  try {
    const feedback = await FeedbackModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(feedbackId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          user: {
            _id: 1,
            name: 1,
            email: 1,
          },
          createdAt: 1,
        },
      },
    ]);

    console.log(feedback);
    if (!feedback[0]) {
      throw new APIError('Feedback not found', httpStatus.NOT_FOUND, true);
    }
    return feedback[0];
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function createFeedback(feedbackData) {
  const FeedbackModel = this.model(modelNames.feedback);
  try {
    const feedback = await FeedbackModel.create(feedbackData);
    return feedback;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function deleteFeedback(feedbackId) {
  const FeedbackModel = this.model(modelNames.feedback);
  try {
    const feedback = await FeedbackModel.findByIdAndDelete(feedbackId);
    if (!feedback) {
      throw new APIError('Feedback not found', httpStatus.NOT_FOUND, true);
    }
    return feedback;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}
export async function updateFeedback(feedbackId, feedbackData) {
  const FeedbackModel = this.model(modelNames.feedback);
  const currentFeedback = await FeedbackModel.findById(feedbackId);
  if (!currentFeedback) {
    throw new APIError('Feedback not found', httpStatus.NOT_FOUND, true);
  }

  const updateFields = {
    title: feedbackData.title || currentFeedback.title,
    content: feedbackData.content || currentFeedback.content,
  };
  try {
    const feedback = await FeedbackModel.findByIdAndUpdate(
      feedbackId,
      updateFields,
      {
        new: true,
      }
    );
    return feedback;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}
