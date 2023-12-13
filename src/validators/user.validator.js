import { body, param } from 'express-validator';

export const registerUserValidator = () => [
  body('name')
    .isString()
    .isLength({ min: 5, max: 40 })
    .withMessage('name is required and must be at least 5 characters'),
  body('phoneNumber')
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
    .custom((val) => ['admin', 'sales', 'encoder'].includes(val.toLowerCase()))
    .withMessage('A valid role is required'),
];

export const updateUserValidator = () => [
  body('name')
    .isString()
    .optional()
    .isLength({ min: 5, max: 40 })
    .withMessage('name is required and must be at least 5 characters'),
  body('phoneNumber')
    .isString()
    .custom((phone) => {
      const regex = /((^(2517|2519|07|09)\d{3})-?\d{5})/;
      return regex.test(phone);
    })
    .optional()
    .isLength({ min: 10, max: 12 })
    .withMessage(
      'Phone number is required and must be valid. valid codes are 2517/07 or 2519/09'
    )
    .optional(),
  body('role')
    .isString()
    .custom((val) => ['admin', 'sales', 'encoder'].includes(val.toLowerCase()))
    .withMessage('A valid role is required')
    .optional(),
];

export const getUserValidator = () => [
  param('userId').isMongoId().withMessage('userId is not valid mongoId'),
];

export const deleteUserValidator = () => [
  param('userId').isMongoId().withMessage('userId is not valid mongoId'),
];
