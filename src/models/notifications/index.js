import mongoose from 'mongoose';
import notificationSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import modelNames from '../../utils/constants';

notificationSchema.static(staticFunctions);
notificationSchema.method(methodFunctions);

const Notifications = mongoose.model(
  modelNames.notification,
  notificationSchema
);

export default Notifications;
