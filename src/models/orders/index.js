import mongoose from 'mongoose';
import orderSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import modelNames from '../../utils/constants';

orderSchema.static(staticFunctions);
orderSchema.method(methodFunctions);

const Order = mongoose.model(modelNames.order, orderSchema);

export default Order;
