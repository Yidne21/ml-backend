import httpStatus from 'http-status';
import User from '../models/users';

export const registerUserController = async (req, res, next) => {
  const { name, phoneNumber, password, role } = req.body;

  const creatUserParams = { name, phoneNumber, password, role };
  console.log('-----------1--------');
  try {
    const user = await User.registerUser(creatUserParams);
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const getSingleUserByIdController = async (req, res, next) => {
  const { userId } = req.params;

  console.log('-----------1--------');
  try {
    const user = await User.getSingleUserById(userId);
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUserByIdController = async (req, res, next) => {
  const { userId } = req.params;

  console.log('-----------1--------');
  try {
    const message = await User.deleteUser(userId);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { name, phoneNumber } = req.body;

  const userParams = { userId, name, phoneNumber };
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
