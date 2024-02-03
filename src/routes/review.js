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
router.get('/:id', reviewDetailController);
router.get('/', filterReviewController);
router.put('/:id', updateReviewController);
router.delete('/:id', deleteReviewController);

export default router;
