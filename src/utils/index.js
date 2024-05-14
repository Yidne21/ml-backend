import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import otpGenerator from 'otp-generator';
import { jwtKey, jwtRefreshKey, appDomain } from '../config/environments';
import APIError from '../errors/APIError';
import { getMailer } from '../config/nodemailer';

const generateJwtAccessToken = (userId, expiresIn = '30d') => {
  const token = jwt.sign({ _id: userId }, jwtKey, { expiresIn });
  return token;
};

const generateHashedPassword = async (cleanPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(cleanPassword, salt);
  return hashedPassword;
};

const generateJwtRefreshToken = (userId, expiresIn = '30d') => {
  const token = jwt.sign({ _id: userId }, jwtRefreshKey, { expiresIn });
  return token;
};

const generateAccountActivationUrl = (
  passwordOrKey,
  userId,
  email,
  expiresIn = '24h'
) => {
  const token = jwt.sign({ _id: userId }, passwordOrKey, { expiresIn });
  // Change this with the appropirate route that will open your client side and send the token and email to the activate endpoint
  const url = `http://localhost:5173/change-password?token=${token}&email=${email}`;
  return url;
};

const sendEmail = async (emailContent) => {
  try {
    const mailer = await getMailer();
    mailer.sendMail(emailContent);
  } catch (error) {
    throw new Error('Error sending email');
  }
};

const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, jwtRefreshKey);

    return decoded;
  } catch (error) {
    throw new APIError(
      'invalid refresh Token or expired token please sign in again',
      httpStatus.UNAUTHORIZED,
      true
    );
  }
};

// Function to calculate distance between two coordinates using Haversine formula
const calculateDistance = ({ lat1, long1, lat2, long2 }) => {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLong = deg2rad(long2 - long1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const generateOtp = (length = 6) => {
  const otp = otpGenerator.generate(length, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

const paginationPipeline = (page, limit) => {
  return [
    {
      $facet: {
        paginationInfo: [
          { $count: 'totalDocuments' },
          {
            $addFields: {
              totalDocuments: { $ifNull: ['$totalDocuments', 0] },
              totalPages: {
                $ceil: {
                  $divide: [
                    { $ifNull: ['$totalDocuments', 1] },
                    parseInt(limit, 10),
                  ],
                },
              },
            },
          },
          {
            $project: {
              totalDocuments: 1,
              totalPages: 1,
            },
          },
        ],
        results: [
          { $skip: (parseInt(page, 10) - 1) * parseInt(limit, 10) },
          { $limit: parseInt(limit, 10) },
        ],
      },
    },
    {
      $unwind: { path: '$paginationInfo', preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        totalDocuments: { $ifNull: ['$paginationInfo.totalDocuments', 0] },
        totalPages: { $ifNull: ['$paginationInfo.totalPages', 0] },
        data: '$results',
      },
    },
  ];
};

export {
  calculateDistance,
  generateJwtAccessToken,
  generateJwtRefreshToken,
  verifyRefreshToken,
  generateHashedPassword,
  paginationPipeline,
  sendEmail,
  generateOtp,
  generateAccountActivationUrl,
  addMinutes,
};
