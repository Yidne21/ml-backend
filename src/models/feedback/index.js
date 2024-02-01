import mongoose from 'mongoose';
import feedbackSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import modelNames from '../../utils/constants';

feedbackSchema.static(staticFunctions);
feedbackSchema.method(methodFunctions);

const Feedback = mongoose.model(modelNames.feedback, feedbackSchema);

export default Feedback;
