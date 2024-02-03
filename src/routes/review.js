import express from 'express';
import {
  createReviewController,
  reviewDetailController,
  filterReviewController,
  updateReviewController,
  deleteReviewController,
} from '../controllers/review';

const router = express.Router();

router.post('/', createReviewController);
router.get('/:reviewId', reviewDetailController);
router.get('/', filterReviewController);
router.put('/:reviewId', updateReviewController);
router.delete('/:reviewId', deleteReviewController);

export default router;
