import nodemailer from 'nodemailer';
import { env } from '../env.js';
import logger from './logger.js';

const config = {
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(config);

export async function sendEmail(opt: { subject?: string; text?: string } = {}) {
  const { subject = '', text = '' } = opt;
  if (!subject) {
    logger.error('subject required');
    return;
  }

  const mailConfig = {
    from: `划水AI<${env.EMAIL_USER}>`, // '昵称<发件人邮箱>'
    subject,
    to: env.EMAIL_TO,
    text,
  };
  const res = await transporter.sendMail(mailConfig);
  logger.info({ messageId: res.messageId }, 'Message sent');
  return res;
}
