import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import {
  generateJwtAccessToken,
  generateJwtRefreshToken,
  verifyRefreshToken,
} from '../../utils/index';

export async function signUpUser({ name, phoneNumber, password, role }) {
  const hashedpassword = await bcrypt.hash(password, 10);
  const UserModel = this.model(modelNames.user);

  const user = {
    name,
    phoneNumber,
    role,
    password: hashedpassword,
  };

  const existingUser = await UserModel.find({ phoneNumber });
  if (existingUser.length > 0) {
    throw new APIError(
      `This ${phoneNumber} phone number is already used try another`,
      httpStatus.CLIENT_ERROR
    );
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

export async function userDetail(userId) {
  const UserModel = this.model(modelNames.user);

  try {
    const existingUser = await UserModel.find({
      _id: mongoose.Types.ObjectId(userId),
    });

    if (existingUser.length === 0) {
      throw new APIError('user not found', httpStatus.NOT_FOUND);
    }
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          name: 1,
          phoneNumber: 1,
          avatar: 1,
          email: 1,
          address: 1,
          location: 1,
          coverPhoto: 1,
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
      throw new APIError('Incorrect old password', httpStatus.UNAUTHORIZED);
    } else {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }
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

export async function getAllUser() {
  const UserModel = this.model(modelNames.user);
  try {
    const users = await UserModel.aggregate([
      {
        $project: {
          name: 1,
          phoneNumber: 1,
          role: 1,
        },
      },
    ]);

    return users;
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
  const { phoneNumber, password } = data;
  const user = await this.findOne({ phoneNumber }).exec();
  const doesntMatchError = new APIError(
    "Email or Password doesn't match",
    httpStatus.UNAUTHORIZED,
    true
  );
  if (!user) {
    throw doesntMatchError;
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

  throw doesntMatchError;
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
