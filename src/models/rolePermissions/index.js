import mongoose from 'mongoose';
import grantListSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import modelNames from '../../utils/constants';

grantListSchema.static(staticFunctions);
grantListSchema.method(methodFunctions);

const RolesPermissions = mongoose.model(
  modelNames.rolePermissions,
  grantListSchema
);

export default RolesPermissions;
