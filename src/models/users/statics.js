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

export async function registerUser(creatUserParams) {
  const { name, phoneNumber, password, role } = creatUserParams;
  const hashedpassword = await bcrypt.hash(password, 10);
  const UserModel = this.model(modelNames.user);

  const user = {
    name,
    phoneNumber,
    role,
    password: hashedpassword,
  };

  const existingUser = await UserModel.find({ phoneNumber });
  if (existingUser !== 0) {
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

export async function getSingleUserById(id) {
  const UserModel = this.model(modelNames.user);

  try {
    const existingUser = await UserModel.find({
      _id: mongoose.Types.ObjectId(id),
    });

    if (existingUser.length === 0) {
      throw new APIError('user not found', httpStatus.NOT_FOUND);
    }
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          name: 1,
          phoneNumber: 1,
          role: 1,
        },
      },
    ]);

    return { ...user };
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
    console.log(deletedUser);

    return {
      message: 'user deleted successfuly',
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

export async function updateUser(userParams) {
  const UserModel = this.model(modelNames.user);

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userParams.userId,
      {
        name: userParams.name,
        phoneNumber: userParams.phoneNumber,
        email: userParams.email,
      },
      { new: true }
    );

    return updatedUser;
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
