import mongoose from 'mongoose';
import userSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import modelNames from '../../utils/constants';

userSchema.static(staticFunctions);
userSchema.method(methodFunctions);

const User = mongoose.model(modelNames.user, userSchema);

export default User;
