import passport from 'passport';
import httpStatus from 'http-status';
import APIError from '../errors/APIError';

const requireJwtAuth = (req, res, next) => {
  if (req.headers && !req.headers.authorization) {
    return next(new APIError('Token not found!', httpStatus.BAD_REQUEST, true));
  }

  return passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }

    if (!user) {
      throw new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true);
    }

    req.user = user;
    return next();
  })(req, res, next);
};

export default requireJwtAuth;
