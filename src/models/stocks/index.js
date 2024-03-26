import mongoose from 'mongoose';
import stockSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import modelNames from '../../utils/constants';

stockSchema.static(staticFunctions);
stockSchema.method(methodFunctions);

const Stock = mongoose.model(modelNames.stock, stockSchema);

export default Stock;
