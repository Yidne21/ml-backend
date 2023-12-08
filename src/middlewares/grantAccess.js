/* eslint-disable consistent-return */
import ac from '../config/accesscontrol';

const grantAccess = (action, resource) => async (req, res, next) => {
  try {
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

export default grantAccess;
