/* eslint-disable import/no-extraneous-dependencies */
import httpStatus from 'http-status';
import User from '../models/users';
import APIError from '../errors/APIError';
import Otp from '../models/otps';
import { generateOtp } from '../utils';

export const sendOTP = async (req, res, next) => {
  const { email, type } = req.body;
  const otp = generateOtp(6);
  const otpPayload = { otp, email, type };
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new APIError('email not found', httpStatus.NOT_FOUND);
    }
    const message = await Otp.createOtp(otpPayload);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  const { email, code } = req.body;
  try {
    const data = {
      email,
      otp: code,
    };
    const message = await Otp.verifyOtp(data);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  const { email, newPassword } = req.body;

  const params = { email, newPassword };

  try {
    const message = await User.resetPassword(params);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const signUpUserController = async (req, res, next) => {
  const { name, phoneNumber, password, email, role } = req.body;

  const otps = await Otp.findOne({
    email,
  });

  if (!otps || otps.email !== email || otps.verified === false) {
    throw new APIError('invalid email', httpStatus.UNAUTHORIZED);
  }

  const creatUserParams = {
    name,
    phoneNumber,
    password,
    role,
    email,
  };
  try {
    const user = await User.signUpUser(creatUserParams);
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const userDetailController = async (req, res, next) => {
  const { _id, role } = req.user;
  const userId = _id;

  try {
    const user = await User.userDetail(userId, role);
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUserByIdController = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const message = await User.deleteUser(userId);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (req, res, next) => {
  const { userId } = req.params;
  const {
    phoneNumber,
    avatar,
    status,
    coverPhoto,
    newPassword,
    oldPassword,
    address,
  } = req.body;
  const userParams = {
    userId,
    phoneNumber,
    avatar,
    coverPhoto,
    newPassword,
    address,
    oldPassword,
    status,
  };

  try {
    const updatedUser = await User.updateUser(userParams);
    res.status(httpStatus.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getAllUserController = async (req, res, next) => {
  const { role, name, email, phoneNumber, sortBy, sortOrder, limit, page } =
    req.query;
  const filter = {
    role,
    name,
    email,
    phoneNumber,
    sortBy,
    sortOrder,
    limit,
    page,
  };
  try {
    const users = await User.getAllUser(filter);
    res.status(httpStatus.OK).json(users);
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  const { password, email } = req.body;
  const data = { password, email };
  try {
    const user = await User.loginUser(data);
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (req, res, next) => {
  const refreshToken = req.header('X-Refresh-Token');
  try {
    const accessToken = await User.refreshToken(refreshToken);
    res.status(httpStatus.OK).json(accessToken);
  } catch (error) {
    next(error);
  }
};

export const registerPharmacistController = async (req, res, next) => {
  const { name, password, email } = req.body;

  try {
    if (!req.file) {
      throw new Error('Please upload a file');
    }

    const data = {
      name,
      password,
      role: 'pharmacist',
      email,
      file: req.file,
    };

    const user = await User.registerPharmacist(data);

    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const registerAdminController = async (req, res, next) => {
  const { name, password, email } = req.body;

  try {
    const data = {
      name,
      password,
      role: 'admin',
      email,
    };

    const user = await User.registerAdmin(data);

    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};
