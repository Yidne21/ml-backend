import { body, param, query } from 'express-validator';

export const sendOTPValidator = () => [
  body('email').isEmail().withMessage('Email is required'),
  body('type')
    .isString()
    .custom((val) => ['forgot', 'verify'].includes(val))
    .withMessage('A valid type is required'),
];

export const verifyOTPValidator = () => [
  body('email').isEmail().withMessage('Email is required'),
  body('code').isString().withMessage('Code is required'),
];
export const resetPasswordValidator = () => [
  body('email').isEmail().withMessage('Email is required'),
  body('newPassword')
    .isString()
    .isLength({ min: 4, max: 60 })
    .withMessage(
      'Password should be at least 4 cahracters and not greater than 60'
    ),
];

export const signUpUserValidator = () => [
  body('name')
    .isString()
    .isLength({ min: 5, max: 40 })
    .withMessage('name is required and must be at least 5 characters'),
  body('phoneNumber')
    .optional()
    .isString()
    .custom((phone) => {
      const regex = /((^(2517|2519|07|09)\d{3})-?\d{5})/;
      return regex.test(phone);
    })
    .isLength({ min: 10, max: 12 })
    .withMessage(
      'Phone number is required and must be valid. valid codes are 2517/07 or 2519/09'
    ),
  body('password')
    .isString()
    .isLength({ min: 4, max: 60 })
    .withMessage(
      'Password should be at least 4 cahracters and not greater than 60'
    ),
  body('role')
    .isString()
    .custom((val) =>
      ['admin', 'pharmacist', 'customer', 'superAdmin'].includes(
        val.toLowerCase()
      )
    )
    .withMessage('A valid role is required'),
  body('email').isEmail().withMessage('Email is required'),
];

export const userDetailValidator = () => [
  param('userId').isMongoId().withMessage('a valid user Id is required'),
];

export const updateUserValidator = () => [
  body('name')
    .optional()
    .isString()
    .isLength({ min: 5, max: 40 })
    .withMessage('name is required and must be at least 5 characters'),
  body('phoneNumber')
    .optional()
    .isString()
    .custom((phone) => {
      const regex = /((^(2517|2519|07|09)\d{3})-?\d{5})/;
      return regex.test(phone);
    })
    .isLength({ min: 10, max: 12 })
    .withMessage(
      'Phone number is required and must be valid. valid codes are 2517/07 or 2519/09'
    ),
  body('avatar').optional().isURL().withMessage('avatar must be a valid url'),
  body('coverPhoto')
    .optional()
    .isURL()
    .withMessage('cover photo must be a valid url'),
  body('status')
    .optional()
    .isString()
    .custom((status) => ['active', 'inactive', 'deactivated'].includes(status))
    .withMessage('status must be a string'),
];

export const deleteUserValidator = () => [
  param('userId').isMongoId().withMessage('a valid user Id is required'),
];

export const getAllUserValidator = () => [
  query('page').optional().isInt().withMessage('page must be a number'),
  query('limit').optional().isInt().withMessage('limit must be a number'),
  query('name').optional().isString().withMessage('name must be a string'),
  query('email')
    .optional()
    .isEmail()
    .withMessage('email must be a valid email'),
  query('phoneNumber')
    .optional()
    .isString()
    .withMessage('phone must be a string'),
  query('role').optional().isString().withMessage('role must be a string'),
  query('sortBy').optional().isString().withMessage('sortBy must be a string'),
  query('sortOrder')
    .optional()
    .isString()
    .withMessage('sortOrder must be a string'),
];

export const loginValidator = () => [
  body('email').isEmail().withMessage('Valid Email is required'),
  body('password').isString().withMessage('Password is required'),
];

export const refreshTokenValidator = () => [
  body('refreshToken').isString().withMessage('refresh token is required'),
];

export const registerPharmacistValidator = () => [
  body('name')
    .isString()
    .isLength({ min: 5, max: 40 })
    .withMessage('name is required and must be at least 5 characters'),
  body('email').isEmail().withMessage('Email is required'),
  body('password')
    .isString()
    .isLength({ min: 4, max: 60 })
    .withMessage(
      'Password should be at least 4 cahracters and not greater than 60'
    ),
];

export const registerAdminValidator = () => [
  body('name')
    .isString()
    .isLength({ min: 5, max: 40 })
    .withMessage('name is required and must be at least 5 characters'),
  body('email').isEmail().withMessage('Email is required'),
  body('role')
    .optional()
    .isString()
    .custom((role) => {
      ['admin', 'superAdmin'].includes(role);
    })
    .withMessage('A valid role is required must be either admin or superAdmin'),
];

export const setPasswordValidator = () => [
  body('email').isEmail().withMessage('Email is required'),
  body('password')
    .isString()
    .isLength({ min: 4, max: 60 })
    .withMessage(
      'Password should be at least 4 cahracters and not greater than 60'
    ),
  body('token').isString().withMessage('Token is required'),
];
