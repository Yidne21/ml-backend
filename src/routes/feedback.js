import express from 'express';
import {
  createFeedbackController,
  feedbackDetailController,
  filterFeedbackController,
  deleteFeedbackController,
  updateFeedbackController,
} from '../controllers/feedback';

const router = express.Router();

router.post('/', createFeedbackController);
router.get('/:id', feedbackDetailController);
router.get('/', filterFeedbackController);
router.delete('/:id', deleteFeedbackController);
router.put('/:id', updateFeedbackController);

export default router;
