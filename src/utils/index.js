import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { jwtKey, jwtRefreshKey } from '../config/environments';
import APIError from '../errors/APIError';

const generateJwtAccessToken = (userId, expiresIn = '15m') => {
  const token = jwt.sign({ _id: userId }, jwtKey, { expiresIn });
  return token;
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

export { generateJwtAccessToken, generateJwtRefreshToken, verifyRefreshToken };
