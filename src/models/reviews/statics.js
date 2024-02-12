import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import { paginationPipeline } from '../../utils/index';

export async function filterReview({
  pharmacyId,
  sortBy,
  sortOrder,
  pharmacyName,
  pharmacyEmail,
  userName,
  userEmail,
  page = 1,
  limit = 10,
}) {
  const ReviewModel = this.model(modelNames.review);

  try {
    const reviews = await ReviewModel.aggregate([
      {
        $match: {
          ...(pharmacyId && {
            pharmacyId: mongoose.Types.ObjectId(pharmacyId),
          }),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'reviewedBy',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'pharmacies',
          localField: 'pharmacyId',
          foreignField: '_id',
          as: 'pharmacy',
        },
      },
      {
        $unwind: '$pharmacy',
      },
      {
        $match: {
          ...(pharmacyName && {
            'pharmacy.name': { $regex: pharmacyName, $options: 'i' },
          }),
          ...(pharmacyEmail && {
            'pharmacy.email': { $regex: pharmacyEmail, $options: 'i' },
          }),
          ...(userName && {
            'user.name': { $regex: userName, $options: 'i' },
          }),
          ...(userEmail && {
            'user.email': { $regex: userEmail, $options: 'i' },
          }),
        },
      },
      {
        $project: {
          _id: 1,
          rating: 1,
          feedback: 1,
          reviewedBy: 1,
          pharmacyId: 1,
          'user.name': 1,
          'user.email': 1,
          'pharmacy.name': 1,
          'pharmacy.email': 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: {
          [sortBy || 'createdAt']: sortOrder === 'desc' ? -1 : 1,
        },
      },
      ...paginationPipeline(page, limit),
    ]);

    return reviews[0];
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
    const reviewExists = await ReviewModel.find({ _id: reviewId });
    if (!reviewExists) {
      throw new APIError('Review not found', httpStatus.NOT_FOUND, true);
    }

    const review = await ReviewModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(reviewId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'reviewedBy',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'pharmacies',
          localField: 'pharmacyId',
          foreignField: '_id',
          as: 'pharmacy',
        },
      },
      {
        $unwind: '$pharmacy',
      },
      {
        $project: {
          _id: 1,
          rating: 1,
          feedback: 1,
          reviewedBy: 1,
          pharmacyId: 1,
          'user.name': 1,
          'user.email': 1,
          'pharmacy.name': 1,
          'pharmacy.email': 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    if (!review[0]) {
      throw new APIError('Review not found', httpStatus.NOT_FOUND, true);
    }
    return review[0];
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
  const currentReview = await ReviewModel.findById(reviewId);
  if (!currentReview) {
    throw new APIError('Review not found', httpStatus.NOT_FOUND, true);
  }

  const updatedFields = {
    rating: reviewData.rating || currentReview.rating,
    feedback: reviewData.feedback || currentReview.feedback,
  };
  try {
    const review = await ReviewModel.findByIdAndUpdate(
      reviewId,
      updatedFields,
      {
        new: true,
      }
    );
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
