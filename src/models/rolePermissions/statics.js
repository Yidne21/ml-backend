import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';

export async function getGrantList() {
  const RolesPermissions = this.model(modelNames.rolePermissions);
  try {
    const rolesPermissions = await RolesPermissions.aggregate([
      {
        $match: {},
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: 1,
          attributes: 1,
        },
      },
    ]);
    return rolesPermissions;
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

export async function getCartByRoles({ userId, page, limit }) {
  return this.filterCart({ userId, page, limit });
}
