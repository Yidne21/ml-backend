import express from 'express';
import uploadFileController from '../controllers/uploadFile';
import multerUploads from '../middlewares/multer';

const router = express.Router();

router.post('/upload', multerUploads.single('file'), uploadFileController);

export default router;
