import mongoose from 'mongoose';
import otpSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import modelNames from '../../utils/constants';

otpSchema.static(staticFunctions);
otpSchema.method(methodFunctions);

const Otp = mongoose.model(modelNames.otp, otpSchema);

export default Otp;
