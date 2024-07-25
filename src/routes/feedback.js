import express from 'express';
import {
  createFeedbackController,
  feedbackDetailController,
  filterFeedbackController,
  deleteFeedbackController,
  updateFeedbackController,
} from '../controllers/feedback';

import { authenticateJwt } from '../middlewares';

const router = express.Router();

router.post('/', authenticateJwt, createFeedbackController);
router.get('/:feedbackId', feedbackDetailController);
router.get('/', filterFeedbackController);
router.delete('/:feedbackId', authenticateJwt, deleteFeedbackController);
router.put('/:feedbackId', authenticateJwt, updateFeedbackController);

export default router;
