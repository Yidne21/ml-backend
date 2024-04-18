import DataURIParser from 'datauri/parser';
import { uploader } from '../config/cloudinary';

const uploadFiles = async (files, folderName) => {
  const parser = new DataURIParser();
  try {
    // Map over each file and upload it to Cloudinary
    const uploadPromises = files.map((file) => {
      // Convert the file buffer to a data URI
      const fileDataUri = parser.format(file.mimetype, file.buffer).content;
      // Upload the file to Cloudinary

      return uploader.upload(fileDataUri, {
        asset_folder: folderName,
        public_id: `${file.originalname}pharmacy`,
        overwrite: true,
        resource_type: 'auto',
      });
    });

    // Wait for all uploads to complete and return the secure URLs
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadFile = async (file, folderName) => {
  const parser = new DataURIParser();
  try {
    const fileDataUri = parser.format(file.mimetype, file.buffer).content;

    const result = await uploader.upload(fileDataUri, {
      asset_folder: folderName,
      public_id: file.originalname,
      overwrite: true,
      resource_type: 'auto',
    });

    return result.secure_url;
  } catch (error) {
    throw new Error(error);
  }
};

export default uploadFiles;
