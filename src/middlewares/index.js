/* eslint-disable consistent-return */

import httpStatus from 'http-status';
import passport from 'passport';
import ac from '../config/accesscontrol';
import APIError from '../errors/APIError';

const authenticateJwt = (req, res, next) => {
  if (req.headers && !req.headers.authorization) {
    const missingTokenError = new APIError(
      'Token not found! Provide credential',
      httpStatus.BAD_REQUEST
    );
    return next(missingTokenError);
  }

  return passport.authenticate(
    'jwt',
    { session: false },
    (error, user, message) => {
      if (error || !user) {
        throw new APIError(message, httpStatus.UNAUTHORIZED, true);
      }

      req.user = user.clean();
      return next();
    }
  )(req, res, next);
};

const grantAccess = (action, resource) => async (req, res, next) => {
  try {
    if (req.user.role === 'admin' && resource !== 'loanOffer') return next();
    const permission = ac.can(req.user.role)[action](resource);
    if (!permission.granted) {
      return res.status(401).json({
        error: "You don't have enough permission to perform this action",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const getProjection = (role, resource) => {
  const permission = ac.can(role).read(resource);

  const notAllowedAttributes = permission.attributes
    .filter((attr) => attr.startsWith('!'))
    .map((attr) => attr.substring(1));

  const projection = {};

  if (notAllowedAttributes.length > 0) {
    notAllowedAttributes.forEach((attribute) => {
      projection[attribute] = 0;
    });
  }

  return projection;
};

const requireLocalAuth = (req, res, next) => {
  return passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(422).send(info);
    }
    req.user = user;
    next();
  })(req, res, next);
};

export { authenticateJwt, grantAccess, requireLocalAuth, getProjection };
