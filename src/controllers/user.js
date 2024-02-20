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
  console.log(phoneNumber);

  try {
    const existingUser = await User.find({ phoneNumber });
    if (!existingUser || existingUser.length === 0) {
      throw new APIError("Phone number doesn't exist", httpStatus.BAD_REQUEST);
    }

    const otpResponse = await client.verify.v2
      .services(environments.twilioServiceId)
      .verifications.create({ to: phoneNumber, channel: 'sms' });
    res.status(httpStatus.OK).json(otpResponse);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  const { phoneNumber, code } = req.body;
  try {
    const otpResponse = await client.verify.v2
      .services(environments.twilioServiceId)
      .verificationChecks.create({ to: phoneNumber, code });
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
  const { name, phoneNumber, password, role, email } = req.body;

  const creatUserParams = { name, phoneNumber, password, role, email };
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
  const { phoneNumber, password, email } = req.body;
  const data = { phoneNumber, password, email };
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
  const {
    name,
    phoneNumber,
    password,
    email,
    pharmaciestLicense,
    pharmacyName,
    pharmacyLocation,
    pharmacyEmail,
    pharmacyPhoneNumber,
    pharmacyLicense,
  } = req.body;

  const data = {
    name,
    phoneNumber,
    password,
    role: 'pharmacist',
    email,
    pharmaciestLicense,
    pharmacyName,
    pharmacyLocation,
    pharmacyEmail,
    pharmacyPhoneNumber,
    pharmacyLicense,
  };
  try {
    const user = await User.registerPharmacist(data);
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const activateAccountController = async (req, res, next) => {
  const { email, token } = req.body;

  try {
    const user = await User.validateActivationToken(token, email);
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async (req, res, next) => {
  const { email } = req.body;

  try {
    const message = await User.forgotPassword(email);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordWithEmailController = async (req, res, next) => {
  const { email, token, newPassword } = req.body;

  try {
    const message = await User.resetPasswordWithEmail(
      email,
      token,
      newPassword
    );
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};
