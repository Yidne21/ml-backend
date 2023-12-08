/* eslint-disable consistent-return */
import passport from 'passport';

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

export default requireLocalAuth;
