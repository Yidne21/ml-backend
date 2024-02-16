import Joi from 'joi';
import dotenv from 'dotenv';

// Initiate dotenv to interact with .env file values
dotenv.config();

// Environment variables validation schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'test', 'production')
    .default('development'),
  MONGO_URL: Joi.string().required().description('MongoDb connection URL'),
  MONGO_ATLAS_URL: Joi.string().required().description('MongoDb Atlas URL'),
  MONGO_TEST_URL: Joi.string().required().description('Mongo Test DB URL'),
  PORT: Joi.number().default(5000),
  JWT_KEY: Joi.string().required(),
  JWT_REFRESH_KEY: Joi.string().required(),
})
  .unknown()
  .required();

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Env vars validation error: ${error.message}`);
}

export const nodeEnv = value.NODE_ENV;
export const port = value.PORT;
export const mongoUrl =
  value.NODE_ENV === 'test' ? value.MONGO_URL : value.MONGO_ATLAS_URL;
export const jwtKey = value.JWT_KEY;
export const jwtRefreshKey = value.JWT_REFRESH_KEY;
export const appEmailAddress = value.APP_EMAIL_ADDRESS;
export const appDomain = value.APP_DOMAIN;
export const appName = value.APP_NAME;
export const twilioAuthToken = value.TWILIO_AUTH_TOKEN;
export const twilioAccountSid = value.TWILIO_ACCOUNT_SID;
export const twilioServiceId = value.TWILIO_SERVICE_ID;
export const mailgunUserName = value.MAILGUN_USER_NAME;
export const mailgunPassword = value.MAILGUN_PASSWORD;
export const mailgunHost = value.MAILGUN_HOST;
export const mailgunPort = value.MAILGUN_PORT;
export const secretKey = value.SECRET_KEY;
export const chapaBaseUrl = value.CHAPA_BASE_URL;
export const chapaPublicKey = value.CHPA_PUBLIC_KEY;
export const chapaSecretKey = value.CHAPA_SECRET_KEY;
export const chapaEncryptionKey = value.CHPA_ENCRYPTION_KEY;
