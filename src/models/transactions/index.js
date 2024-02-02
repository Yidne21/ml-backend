import mongoose from 'mongoose';
import transactionSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import modelNames from '../../utils/constants';

transactionSchema.static(staticFunctions);
transactionSchema.method(methodFunctions);

const Transaction = mongoose.model(modelNames.transaction, transactionSchema);

export default Transaction;
