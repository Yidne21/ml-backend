import mongoose from 'mongoose';
import pharmacySchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import modelNames from '../../utils/constants';

pharmacySchema.static(staticFunctions);
pharmacySchema.method(methodFunctions);

const Pharmacy = mongoose.model(modelNames.pharmacy, pharmacySchema);

export default Pharmacy;
