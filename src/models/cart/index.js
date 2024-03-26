import mongoose from 'mongoose';
import cartSchema from './schema';
import * as staticFunctions from './statics';
import * as methodFunctions from './methods';
import modelNames from '../../utils/constants';

cartSchema.static(staticFunctions);
cartSchema.method(methodFunctions);

const Cart = mongoose.model(modelNames.cart, cartSchema);

export default Cart;
