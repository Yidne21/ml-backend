import mongoose from 'mongoose';
import { sendEmail } from '../../utils';
import { verifyYourEmail } from '../../utils/mailTemplate';
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
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 9, // auto delete after 5 minutes
  },
});

// eslint-disable-next-line func-names
otpSchema.pre('save', async function (next) {
  const emailTemplate = verifyYourEmail(this.otp);

  const emailContent = {
    to: this.email,
    from: `Medicine Locator <${appEmailAddress}`,
    subject: 'Verify Yor Email',
    html: emailTemplate,
  };
  if (this.isNew) {
    await sendEmail(emailContent);
  }
  next();
});

export default otpSchema;
