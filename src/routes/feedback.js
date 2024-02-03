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
router.get('/:feedbackId', feedbackDetailController);
router.get('/', filterFeedbackController);
router.delete('/:feedbackId', deleteFeedbackController);
router.put('/:feedbackId', updateFeedbackController);

export default router;
