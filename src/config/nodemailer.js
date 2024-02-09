import nodemailer from 'nodemailer';
import winstonLogger from './winston';
import {
  mailgunHost,
  mailgunPassword,
  mailgunPort,
  mailgunUserName,
} from './environments';

console.log(mailgunHost, mailgunPassword, mailgunPort, mailgunUserName);

const getMailer = async () => {
  const config = {
    host: mailgunHost,
    port: mailgunPort,
    auth: {
      user: mailgunUserName,
      pass: mailgunPassword,
    },
  };

  const mailer = nodemailer.createTransport(config);

  return mailer;
};

const nodeMailerVerify = async () => {
  const mailer = getMailer();

  mailer.verify((err) => {
    if (err) {
      winstonLogger.error(
        `[Nodemailer Loader] Verifying mailing account failed: ${err}`
      );
    } else {
      winstonLogger.info(`[Nodemailer] Ready to send messages`);
    }
  });
};

export { getMailer, nodeMailerVerify };
