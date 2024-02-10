import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { jwtKey, jwtRefreshKey, appDomain } from '../config/environments';
import APIError from '../errors/APIError';

const generateJwtAccessToken = (userId, expiresIn = '15m') => {
  const token = jwt.sign({ _id: userId }, jwtKey, { expiresIn });
  return token;
};

const generateHashedPassword = async (cleanPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(cleanPassword, salt);
  return hashedPassword;
};

const generatePasswordResetUrl = (
  secretKey,
  userId,
  email,
  expiresIn = '24h'
) => {
  const token = jwt.sign({ _id: userId, email }, secretKey, { expiresIn });
  const url = `${appDomain}/reset-password?token=${token}&email=${email}`;
  return url;
};

const generateAccountActivationUrl = (
  passwordOrKey,
  userId,
  email,
  expiresIn = '24h'
) => {
  const token = jwt.sign({ _id: userId }, passwordOrKey, { expiresIn });
  // Change this with the appropirate route that will open your client side and send the token and email to the activate endpoint
  const url = `${appDomain}/activate?token=${token}&email=${email}`;
  return url;
};

const generateJwtRefreshToken = (userId, expiresIn = '30d') => {
  const token = jwt.sign({ _id: userId }, jwtRefreshKey, { expiresIn });
  return token;
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

export {
  generateJwtAccessToken,
  generateJwtRefreshToken,
  verifyRefreshToken,
  generateHashedPassword,
  generatePasswordResetUrl,
  generateAccountActivationUrl,
};
