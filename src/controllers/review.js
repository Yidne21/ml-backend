import httpStatus from 'http-status';
import Review from '../models/reviews';

export const createReviewController = async (req, res, next) => {
  const userId = req.user;
  const { pharmacyId, rating, feedback } = req.body;
  const reviewData = { userId, pharmacyId, rating, feedback };
  try {
    const review = await Review.createReview(reviewData);
    res.status(httpStatus.CREATED).json(review);
  } catch (error) {
    next(error);
  }
};
export const reviewDetailController = async (req, res, next) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.getReviewById(reviewId);
    res.status(httpStatus.OK).json(review);
  } catch (error) {
    next(error);
  }
};
export const filterReviewController = async (req, res, next) => {
  const {
    pharmacyId,
    userId,
    pharmacyName,
    pharmacyEmail,
    userName,
    userEmail,
    page,
    limit,
  } = req.query;

  const filter = {
    pharmacyId,
    userId,
    pharmacyName,
    pharmacyEmail,
    userName,
    userEmail,
  };
  try {
    const reviews = await Review.filterReview(filter);
    res.status(httpStatus.OK).json(reviews);
  } catch (error) {
    next(error);
  }
};
export const updateReviewController = async (req, res, next) => {
  const { reviewId } = req.params;
  const { rating, feedback } = req.body;
  const reviewData = { rating, feedback };
  try {
    const review = await Review.updateReview(reviewId, reviewData);
    res.status(httpStatus.OK).json(review);
  } catch (error) {
    next(error);
  }
};
export const deleteReviewController = async (req, res, next) => {
  const { reviewId } = req.params;
  try {
    await Review.deleteReview(reviewId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
