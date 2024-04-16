import { v2 as cloudinary } from 'cloudinary';
import { cloudEnv } from './environments';

cloudinary.config({
  secure: true,
  cloudEnv,
});

export default cloudinary;
