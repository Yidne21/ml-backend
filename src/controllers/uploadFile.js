import httpStatus from 'http-status';
import { uploadFile } from '../utils/cloudinary';

const uploadFileController = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('please choose a file');
    }
    const secureUrl = await uploadFile(req.file, 'ml_app');

    res.status(httpStatus.ok).json(secureUrl);
  } catch (error) {
    next(error);
  }
};

export default uploadFileController;
