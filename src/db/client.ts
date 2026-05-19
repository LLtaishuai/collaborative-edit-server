import pg from 'pg';
import { sendEmail } from '../lib/mailer.js';
import { env } from '../env.js';
import debounce from 'lodash.debounce';
import logger from '../lib/logger.js';

const { Client } = pg;
const url = env.DATABASE_URL;

export let pgClient: any = new Client(url);

pgClient.on('error', (err: Error) => {
  logger.error(err, 'pg connect db error');

  sendEmail({
    subject: 'hocuspocus pg connect db error',
    text: err.message || 'error',
  });
});

export async function connect() {
  await pgClient.connect();
  logger.info('pg connect db success');
}

export const reconnect = debounce(async () => {
  logger.info('pg will reconnect...');
  pgClient = null;
  await connect();
}, 3 * 1000);
