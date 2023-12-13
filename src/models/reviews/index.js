import mongoose from 'mongoose';
import reviewSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import modelNames from '../../utils/constants';

reviewSchema.static(staticFunctions);
reviewSchema.method(methodFunctions);

const Review = mongoose.model(modelNames.review, reviewSchema);

export default Review;
