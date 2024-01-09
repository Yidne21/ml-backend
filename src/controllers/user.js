/* eslint-disable import/no-extraneous-dependencies */
import httpStatus from 'http-status';
import User from '../models/users';
import * as environments from '../config/environments';
import APIError from '../errors/APIError';

const client = require('twilio')(
  environments.twilioAccountSid,
  environments.twilioAuthToken,
  { lazyLoading: true }
);

export const sendOTP = async (req, res, next) => {
  const { phoneNumber } = req.body;

  try {
    const existingUser = await User.find({ phoneNumber: `+251${phoneNumber}` });
    if (!existingUser || existingUser.length === 0) {
      throw new APIError("Phone number doesn't exist", httpStatus.BAD_REQUEST);
    }

    const otpResponse = await client.verify.v2
      .services(environments.twilioServiceId)
      .verifications.create({ to: `+251${phoneNumber}`, channel: 'sms' });
    res.status(httpStatus.OK).json(otpResponse);
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  const { phoneNumber, code } = req.body;
  try {
    const otpResponse = await client.verify.v2
      .services(environments.twilioServiceId)
      .verificationChecks.create({ to: `+251${phoneNumber}`, code });
    res.status(httpStatus.OK).json(otpResponse);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  const { phoneNumber, newPassword } = req.body;

  const params = { phoneNumber, newPassword };

  try {
    const message = await User.resetPassword(params);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const signUpUserController = async (req, res, next) => {
  const { name, phoneNumber, password, role } = req.body;

  const creatUserParams = { name, phoneNumber, password, role };
  try {
    const user = await User.signUpUser(creatUserParams);
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const userDetailController = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.userDetail(userId);
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
  const { email, avatar, coverPhoto, newPassword, oldPassword, address } =
    req.body;
  const userParams = {
    userId,
    email,
    avatar,
    coverPhoto,
    newPassword,
    address,
    oldPassword,
  };

  try {
    const updatedUser = await User.updateUser(userParams);
    res.status(httpStatus.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getAllUserController = async (req, res, next) => {
  try {
    const users = await User.getAllUser();
    res.status(httpStatus.OK).json(users);
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  const data = { phoneNumber, password };
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
