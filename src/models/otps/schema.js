import mongoose from 'mongoose';
import { sendEmail } from '../../utils';
import emailTemplate from '../../utils/mailTemplate';
import { appEmailAddress } from '../../config/environments';

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    ref: 'User',
  },
  otpType: {
    type: String,
    required: true,
    enum: ['forgot', 'verify'],
    default: 'verify',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 1, // auto delete after 60 minutes
  },
});

// eslint-disable-next-line func-names
otpSchema.pre('save', async function (next) {
  const type =
    this.otpType === 'forgot'
      ? 'Reset Password Code'
      : 'email verification Code';
  const content = emailTemplate(this.otp, type);
  const emailContent = {
    to: this.email,
    from: `Medicine Locator <${appEmailAddress}`,
    subject: type,
    html: content,
  };
  if (this.isNew) {
    await sendEmail(emailContent);
  }
  next();
});

export default otpSchema;
