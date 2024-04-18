import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import {
  generateJwtAccessToken,
  generateJwtRefreshToken,
  verifyRefreshToken,
  generateHashedPassword,
  generatePasswordResetUrl,
  generateAccountActivationUrl,
  paginationPipeline,
} from '../../utils';
import { getMailer } from '../../config/nodemailer';
import { appEmailAddress, secretKey } from '../../config/environments';
import { ForgotPassword, ActivateAccount } from '../../utils/mailTemplate';
import { uploadFile } from '../../utils/cloudinary';

export async function signUpUser({ name, phoneNumber, password, role, email }) {
  const hashedpassword = await bcrypt.hash(password, 10);
  const UserModel = this.model(modelNames.user);

  const user = {
    name,
    phoneNumber,
    role,
    password: hashedpassword,
    email,
  };

  if (phoneNumber) {
    const existingUser = await UserModel.find({ phoneNumber });
    if (existingUser.length > 0) {
      throw new APIError(
        `This ${phoneNumber} phone number is already used try another`,
        httpStatus.CLIENT_ERROR
      );
    }
  }

  if (email) {
    const existingEmail = await UserModel.find({ email });
    if (existingEmail.length > 0) {
      throw new APIError(
        `This ${email} email is already used try another`,
        httpStatus.CLIENT_ERROR
      );
    }
  }

  const newUser = new UserModel(user);

  try {
    await newUser.save();

    return newUser.clean();
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

export async function userDetail(userId, role) {
  const UserModel = this.model(modelNames.user);

  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      ...(role === 'pharmacist' && [
        {
          $lookup: {
            from: 'pharmacies',
            localField: '_id',
            foreignField: 'pharmacistId',
            as: 'pharmacies',
          },
        },
      ]),
      {
        $project: {
          name: 1,
          phoneNumber: 1,
          avatar: 1,
          email: 1,
          address: 1,
          location: 1,
          coverPhoto: 1,
          pharmacies: 1,
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
  email,
  avatar,
  coverPhoto,
  newPassword,
  address,
  oldPassword,
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
    ...(email && { email }),
    ...(avatar && { avatar }),
    ...(coverPhoto && { coverPhoto }),
    ...(hashedPassword && { password: hashedPassword }),
    ...(address && { address }),
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

export async function resetPassword({ phoneNumber, newPassword }) {
  const UserModel = this.model(modelNames.user);

  let hashedPassword;
  if (newPassword) {
    hashedPassword = await bcrypt.hash(newPassword, 10);
  }

  try {
    const user = await UserModel.findOneAndUpdate(
      { phoneNumber },
      { password: hashedPassword },
      {
        new: true,
      }
    );

    if (!user) {
      throw new APIError('User not found', httpStatus.NOT_FOUND);
    }

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
  const { phoneNumber, password, email } = data;
  console.log('data', data);

  let user;

  try {
    if (phoneNumber) {
      user = await this.findOne({ phoneNumber }).exec();
      if (!user) {
        throw new APIError(
          "phoneNumber or Password doesn't match",
          httpStatus.UNAUTHORIZED,
          true
        );
      }
    }

    if (email) {
      user = await this.findOne({
        email,
        role: 'pharmacist' || 'admin' || 'superAdmin',
      }).exec();
      if (!user) {
        throw new APIError(
          "email or Password doesn't match",
          httpStatus.UNAUTHORIZED,
          true
        );
      }
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
  const {
    name,
    phoneNumber,
    password,
    email,
    pharmacyName,
    pharmacyLocation,
    pharmacyEmail,
    pharmacyPhoneNumber,
    files,
  } = data;

  const session = await mongoose.startSession();
  session.startTransaction();
  const hashedpassword = await bcrypt.hash(password, 10);
  const UserModel = this.model(modelNames.user);
  const PharmacyModel = this.model(modelNames.pharmacy);

  if (email) {
    const existingEmail = await UserModel.find({ email });
    if (existingEmail.length > 0) {
      throw new APIError(
        `This ${email} email is already used try another`,
        httpStatus.CLIENT_ERROR
      );
    }
  }

  try {
    const pharmaciestLicense = await uploadFile(files[0], 'pharmaciestLicense');

    const user = {
      name,
      phoneNumber,
      password: hashedpassword,
      role: 'pharmacist',
      email,
      pharmaciestLicense,
      emailVerified: false,
    };

    const pharmacist = await UserModel.create(user);
    pharmacist.clean();

    const activateAccountUrl = generateAccountActivationUrl(
      hashedpassword,
      pharmacist._id,
      email
    );

    const accountActivationEmailTemplate = ActivateAccount(activateAccountUrl);

    const emailContent = {
      to: email,
      from: `Medicine Locator <${appEmailAddress}`,
      subject: 'Activate Account',
      html: accountActivationEmailTemplate,
    };

    try {
      const mailer = await getMailer();
      mailer.sendMail(emailContent);
    } catch (error) {
      throw new Error('Error sending email');
    }

    if (!pharmacist) {
      throw new APIError('Internal Error', httpStatus.INTERNAL_SERVER_ERROR);
    }

    const [lat, lng] = pharmacyLocation.split(',');

    const pharmacyLicense = await uploadFile(files[1], 'pharmacyLicense');

    const pharmacy = {
      name: pharmacyName,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lat), parseFloat(lng)],
      },
      email: pharmacyEmail,
      phoneNumber: pharmacyPhoneNumber,
      pharmacyLicense,
      pharmacistId: pharmacist._id,
    };

    await PharmacyModel.create(pharmacy);

    await session.commitTransaction();

    return {
      message: 'Pharmacist registered successfully',
    };
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      // Handle duplicate key error for email field
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

export async function validateActivationToken(token, email) {
  const tokenOwner = await this.findOne({ email }).exec();
  if (!tokenOwner) {
    throw new APIError('Not found', httpStatus.NOT_FOUND);
  }

  try {
    const decoded = jwt.verify(token, tokenOwner.password);
    if (decoded._id === `${tokenOwner._id}`) {
      tokenOwner.emailVerified = true;
      await tokenOwner.save();
      return tokenOwner.clean();
    }

    throw new APIError('Unauthorized', httpStatus.UNAUTHORIZED);
  } catch (error) {
    throw new APIError('Unauthorized', httpStatus.UNAUTHORIZED);
  }
}

export async function forgotPassword(email) {
  try {
    const tokenOwner = await this.findOne({ email }).exec();

    if (!tokenOwner) {
      throw new APIError('User not found!', httpStatus.NOT_FOUND);
    }

    const resetPasswordUrl = generatePasswordResetUrl(
      secretKey,
      tokenOwner._id,
      tokenOwner.email
    );

    const forgetPasswordEmailTemplate = ForgotPassword(resetPasswordUrl);

    const emailContent = {
      to: tokenOwner.email,
      from: `Medicine Locator <${appEmailAddress}`,
      subject: 'Reset Password',
      html: forgetPasswordEmailTemplate,
    };

    try {
      const mailer = await getMailer();
      mailer.sendMail(emailContent);
      console.log('email sent');
    } catch (error) {
      console.log('error sending email', error);
    }

    return {
      message: 'Password reset email is sent successfully',
      resetPasswordUrl,
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

export async function resetPasswordWithEmail(email, token, newPassword) {
  const tokenOwner = await this.findOne({ email }).exec();
  if (!tokenOwner) {
    throw new APIError('Not found', httpStatus.NOT_FOUND);
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded._id === `${tokenOwner._id}`) {
      tokenOwner.password = await generateHashedPassword(newPassword);
    } else {
      throw new APIError(
        'You are not authorized to change other users password',
        httpStatus.UNAUTHORIZED
      );
    }

    await tokenOwner.save();

    return {
      message: 'Password changed successfully',
      user: tokenOwner.clean(),
    };
  } catch (error) {
    throw new APIError('Unauthorized', httpStatus.UNAUTHORIZED);
  }
}
