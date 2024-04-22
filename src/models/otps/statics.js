import httpStatus from 'http-status';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';

export async function createOtp({ email, type, otp }) {
  const otpModel = this.model(modelNames.otp);
  try {
    const existingOtp = await otpModel.findOne({ email });

    if (existingOtp) {
      await otpModel.findByIdAndDelete(existingOtp._id);
    }

    const newOtp = {
      email,
      otp,
      otpType: type,
    };

    const message = await otpModel.create(newOtp);

    if (!message) {
      throw new APIError(
        'could not send otp',
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return { success: true };
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function verifyOtp({ email, otp }) {
  const otpModel = this.model(modelNames.otp);
  const UserModel = this.model(modelNames.user);

  try {
    const existingOtp = await otpModel.findOne({
      email,
      otp,
    });

    if (!existingOtp || existingOtp.email !== email) {
      throw new APIError(
        'invalid email or expired otp',
        httpStatus.UNAUTHORIZED,
        true
      );
    }

    if (existingOtp.otp !== otp) {
      throw new APIError('invalid otp', httpStatus.UNAUTHORIZED, true);
    }

    if (existingOtp.verified === true) {
      throw new APIError('otp already verified', httpStatus.UNAUTHORIZED, true);
    }

    if (existingOtp.otpType === 'verify') {
      await UserModel.updateOne({ email }, { $set: { emailVerified: true } });
    }

    await otpModel.updateOne({ email }, { verified: true });

    return { valid: true };
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}
