import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { tr } from '@faker-js/faker';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import {
  generateOtp,
  generateJwtAccessToken,
  generateJwtRefreshToken,
  verifyRefreshToken,
  paginationPipeline,
  sendEmail,
  generateAccountActivationUrl,
} from '../../utils';
import { uploadFile } from '../../utils/cloudinary';
import emailTemplate from '../../utils/mailTemplate';
import { appEmailAddress, secretKey } from '../../config/environments';

export async function signUpUser({ name, phoneNumber, password, email }) {
  const hashedpassword = await bcrypt.hash(password, 10);
  const UserModel = this.model(modelNames.user);
  const otpModel = this.model(modelNames.otp);

  const user = {
    name,
    phoneNumber,
    role: 'customer',
    password: hashedpassword,
    email,
  };

  const existingEmail = await UserModel.findOne({ email });
  if (existingEmail) {
    throw new APIError(
      `This ${email} email is already used try another`,
      httpStatus.CLIENT_ERROR
    );
  }

  const newUser = new UserModel(user);

  try {
    const otp = generateOtp(6);

    const otpPayload = {
      otp,
      email,
      type: 'verify',
    };

    const message = await otpModel.createOtp(otpPayload);
    await newUser.save();

    return message;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function userDetail(userId) {
  const UserModel = this.model(modelNames.user);

  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          password: 0,
          __v: 0,
        },
      },
    ]);

    return user[0];
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function deleteUser(id) {
  const UserModel = this.model(modelNames.user);
  try {
    const existingUser = await UserModel.find({
      _id: mongoose.Types.ObjectId(id),
    });

    if (existingUser.length === 0) {
      throw new APIError('User not found', httpStatus.NOT_FOUND);
    }

    const deletedUser = await UserModel.findOneAndDelete(id);
    return {
      message: 'user deleted successfuly',
      user: deletedUser,
    };
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function updateUser({
  userId,
  phoneNumber,
  avatar,
  coverPhoto,
  newPassword,
  address,
  oldPassword,
  status,
}) {
  const UserModel = this.model(modelNames.user);

  const existingUser = await UserModel.findById(userId);

  if (!existingUser) {
    throw new APIError('User not found', httpStatus.NOT_FOUND);
  }

  let hashedPassword;
  if (oldPassword && newPassword) {
    const passwordMatch = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );
    if (!passwordMatch) {
      throw new APIError('Old password is incorrect', httpStatus.UNAUTHORIZED);
    }
    hashedPassword = await bcrypt.hash(newPassword, 10);
  }

  const update = {
    ...(phoneNumber && { phoneNumber }),
    ...(avatar && { avatar }),
    ...(coverPhoto && { coverPhoto }),
    ...(hashedPassword && { password: hashedPassword }),
    ...(address && { address }),
    ...(status && { status }),
  };

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, update, {
      new: true,
    });
    const cleanUser = updatedUser.clean();
    return {
      message: 'User updated successfully',
      user: cleanUser,
    };
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function resetPassword({ email, newPassword }) {
  const UserModel = this.model(modelNames.user);
  const otpModel = this.model(modelNames.otp);

  let hashedPassword;
  if (newPassword) {
    hashedPassword = await bcrypt.hash(newPassword, 10);
  }

  try {
    const existingUser = await UserModel.findOne({
      email,
    });

    if (!existingUser) {
      throw new APIError('Invalid email', httpStatus.UNAUTHORIZED);
    }

    const hasVerifiedOtp = await otpModel.findOne({
      email,
      verified: true,
    });

    if (!hasVerifiedOtp) {
      throw new APIError('Invalid email', httpStatus.UNAUTHORIZED);
    }

    await UserModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      {
        new: true,
      }
    );

    return {
      message: 'password reset successfully',
    };
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function getAllUser({
  role,
  name,
  email,
  phoneNumber,
  sortBy,
  sortOrder,
  limit = 10,
  page = 1,
}) {
  const UserModel = this.model(modelNames.user);
  try {
    const users = await UserModel.aggregate([
      {
        $match: {
          ...(role && { role }),
          ...(name && { name: { $regex: name, $options: 'i' } }),
          ...(email && { email: { $regex: email, $options: 'i' } }),
          ...(phoneNumber && { phoneNumber }),
        },
      },
      {
        $project: {
          name: 1,
          phoneNumber: 1,
          role: 1,
          email: 1,
        },
      },
      {
        $sort: {
          [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1,
        },
      },
      ...paginationPipeline(page, limit),
    ]);

    return users[0];
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function loginUser(data) {
  const { password, email } = data;

  try {
    const user = await this.findOne({
      email,
    }).exec();

    if (!user) {
      throw new APIError(
        "email or Password doesn't match",
        httpStatus.UNAUTHORIZED,
        true
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = generateJwtAccessToken(user._id);
      const newRefreshToken = generateJwtRefreshToken(user._id);
      const cleanUser = user.clean();
      cleanUser.accessToken = token;
      cleanUser.refreshToken = newRefreshToken;
      return cleanUser;
    }

    throw new APIError('Invalid credentials', httpStatus.UNAUTHORIZED, true);
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function refreshToken(token) {
  if (!token) {
    throw new APIError(
      'Referesh Token is required',
      httpStatus.UNAUTHORIZED,
      true
    );
  }

  try {
    const decoded = verifyRefreshToken(token);

    const accessToken = generateJwtAccessToken(decoded._id);

    return { accessToken };
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function registerPharmacist(data) {
  const { name, password, email, file } = data;

  const session = await mongoose.startSession();
  session.startTransaction();
  const hashedpassword = await bcrypt.hash(password, 10);
  const UserModel = this.model(modelNames.user);
  const otpModel = this.model(modelNames.otp);

  const existingEmail = await UserModel.find({ email });
  if (existingEmail.length > 0) {
    session.abortTransaction();
    throw new APIError(
      `This ${email} email is already used try another`,
      httpStatus.CLIENT_ERROR
    );
  }

  try {
    const pharmaciestLicense = await uploadFile(file, 'pharmaciestLicense');

    const user = {
      name,
      password: hashedpassword,
      role: 'pharmacist',
      email,
      pharmaciestLicense,
    };

    const otp = generateOtp(6);

    const otpPayload = {
      otp,
      email,
      type: 'verify',
    };

    const message = await otpModel.createOtp(otpPayload);

    if (!message) {
      throw new APIError(
        'could not send otp',
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    await UserModel.create(user);
    return {
      message: 'please activate your account with the otp sent to your email',
    };
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      await session.abortTransaction();
      session.endSession();
      throw new APIError(
        `Email ${data.email} is already in use`,
        httpStatus.CONFLICT
      );
    } else if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  } finally {
    session.endSession();
  }
}

export async function registerAdmin(data) {
  const { name, email } = data;

  const UserModel = this.model(modelNames.user);

  const existingEmail = await UserModel.find({ email });
  if (existingEmail.length > 0) {
    throw new APIError(
      `This ${email} email is already used try another`,
      httpStatus.CLIENT_ERROR
    );
  }

  try {
    const user = {
      name,
      role: 'admin',
      email,
    };

    const admin = await UserModel.create(user);

    const activationUrl = generateAccountActivationUrl(
      secretKey,
      admin._id,
      email
    );

    const type = 'Admin create password link';
    const content = emailTemplate(activationUrl, type);
    const emailContent = {
      to: email,
      from: `Medicine Locator <${appEmailAddress}`,
      subject: type,
      html: content,
    };

    await sendEmail(emailContent);
    return {
      message: 'Admin created successfully',
    };
  } catch (error) {
    console.log(error);
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function setPassWord({ token, email, password }) {
  const tokenOwner = await this.findOne({ email }).exec();
  if (!tokenOwner) {
    throw new APIError('Not found', httpStatus.NOT_FOUND, true);
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded._id === `${tokenOwner._id}`) {
      const hashedpassword = await bcrypt.hash(password, 10);
      tokenOwner.emailVerified = true;
      tokenOwner.password = hashedpassword;
      await tokenOwner.save();
      return tokenOwner.clean();
    }

    throw new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true);
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}
