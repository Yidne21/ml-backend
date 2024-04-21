/* eslint-disable import/no-extraneous-dependencies */
import httpStatus from 'http-status';
import otpGenerator from 'otp-generator';
import User from '../models/users';
import APIError from '../errors/APIError';
import Otp from '../models/otps';

export const sendOTP = async (req, res, next) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new APIError('email already registered', httpStatus.UNAUTHORIZED);
    }

    const existingOtp = await Otp.findOne({ email });

    if (existingOtp) {
      await Otp.findByIdAndDelete(existingOtp._id);
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const otpPayload = { otp, email };

    const message = await Otp.create(otpPayload);

    if (!message) {
      throw new APIError(
        'could not send otp',
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    res.status(httpStatus.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  const { email, code } = req.body;
  try {
    const otps = await Otp.findOne({
      email,
      otp: code,
    });
    if (!otps || otps.email !== email) {
      throw new Error('invalid email', httpStatus.UNAUTHORIZED);
    }
    if (otps.otp !== code) {
      throw new Error('invalid otp', httpStatus.UNAUTHORIZED);
    }
    if (otps.verified === true) {
      throw new Error(
        'otp already verified try another',
        httpStatus.UNAUTHORIZED
      );
    }
    await Otp.updateOne({ email }, { verified: true });
    res.status(httpStatus.OK).json({ valid: true });
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
  const { phoneNumber, avatar, coverPhoto, newPassword, oldPassword, address } =
    req.body;
  const userParams = {
    userId,
    phoneNumber,
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
  const {
    name,
    phoneNumber,
    password,
    email,
    pharmacyName,
    pharmacyLocation,
    pharmacyEmail,
    pharmacyPhoneNumber,
  } = req.body;

  try {
    if (!req.files || req.files.length < 2) {
      throw new Error('Please upload at least two files');
    }

    const data = {
      name,
      phoneNumber,
      password,
      role: 'pharmacist',
      email,
      pharmacyName,
      pharmacyLocation,
      pharmacyEmail,
      pharmacyPhoneNumber,
      files: req.files,
    };

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
