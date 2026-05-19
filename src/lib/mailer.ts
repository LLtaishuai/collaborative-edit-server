import nodemailer from 'nodemailer';
import 'dotenv/config';
import logger from './logger.js';

const config = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
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
    from: `划水AI<${process.env.EMAIL_USER}>`, // '昵称<发件人邮箱>'
    subject,
    to: process.env.EMAIL_TO,
    text,
  };
  const res = await transporter.sendMail(mailConfig);
  logger.info({ messageId: res.messageId }, 'Message sent');
  return res;
}
