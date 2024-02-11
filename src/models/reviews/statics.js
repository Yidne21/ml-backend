import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';

export async function filterReview({
  pharmacyId,
  userId,
  pharmacyName,
  pharmacyEmail,
  userName,
  userEmail,
  page = 1,
  limit = 10,
}) {
  const ReviewModel = this.model(modelNames.review);
  const filter = {};
  if (pharmacyId) filter.pharmacyId = pharmacyId;
  if (userId) filter.userId = userId;
  if (pharmacyName) filter.pharmacyName = pharmacyName;
  if (pharmacyEmail) filter.pharmacyEmail = pharmacyEmail;
  if (userName) filter.userName = userName;
  if (userEmail) filter.userEmail = userEmail;

  try {
    const reviews = await ReviewModel.find(filter)
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .exec();

    return reviews;
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

export async function createReview(reviewData) {
  const ReviewModel = this.model(modelNames.review);
  try {
    const review = await ReviewModel.create(reviewData);
    return review;
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

export async function getReviewById(reviewId) {
  const ReviewModel = this.model(modelNames.review);
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new APIError('Invalid review id', httpStatus.BAD_REQUEST, true);
  }
  try {
    const review = await ReviewModel.findById(reviewId).exec();
    if (!review) {
      throw new APIError('Review not found', httpStatus.NOT_FOUND, true);
    }
    return review;
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

export async function updateReview(reviewId, reviewData) {
  const ReviewModel = this.model(modelNames.review);
  try {
    const review = await ReviewModel.findByIdAndUpdate(reviewId, reviewData, {
      new: true,
    });
    if (!review) {
      throw new APIError('Review not found', httpStatus.NOT_FOUND, true);
    }
    return review;
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

export async function deleteReview(reviewId) {
  const ReviewModel = this.model(modelNames.review);
  try {
    const review = await ReviewModel.findByIdAndDelete(reviewId);
    if (!review) {
      throw new APIError('Review not found', httpStatus.NOT_FOUND, true);
    }
    return review;
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
