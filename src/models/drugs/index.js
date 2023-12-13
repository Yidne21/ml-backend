import mongoose from 'mongoose';
import drugSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import modelNames from '../../utils/constants';

drugSchema.static(staticFunctions);
drugSchema.method(methodFunctions);

const Drug = mongoose.model(modelNames.drug, drugSchema);

export default Drug;
