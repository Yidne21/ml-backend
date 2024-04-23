import httpStatus from 'http-status';
import { uploadFile } from '../utils/cloudinary';
import APIError from '../errors/APIError';

const uploadFileController = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new APIError('please choose a file', httpStatus.BAD_REQUEST, true);
    }
    const secureUrl = await uploadFile(req.file, 'ml_app');

    res.status(httpStatus.OK).json(secureUrl);
  } catch (error) {
    next(error);
  }
};

export default uploadFileController;
