import { config, uploader } from 'cloudinary';
import { cloudApiKey, cloudApiSecret, cloudName } from './environments';

const cloudinaryConfig = (req, res, next) => {
  config({
    secure: true,
    cloud_name: cloudName,
    api_key: cloudApiKey,
    api_secret: cloudApiSecret,
  });
  next();
};

export { cloudinaryConfig, uploader };
