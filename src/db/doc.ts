import { pgClient, reconnect } from './client.js';
import { sendEmail } from '../lib/mailer.js';
import logger from '../lib/logger.js';

/**
 * Update doc json content
 * @param {string} id doc id
 * @param {string} jsonStr json string
 * @returns {Promise<number>} updated rowCount
 */
export async function updateDocJsonStr(id: string, jsonStr: string): Promise<number> {
  try {
    const sql = `update "Doc" set content = $1, "updatedAt" = $2 where id = $3`;
    const values = [jsonStr, new Date(), id];
    const result = await pgClient.query(sql, values);
    return result.rowCount;
  } catch (err: any) {
    logger.error(err, 'hocuspocus db updateDocJsonStr error');
    sendEmail({
      subject: 'hocuspocus db updateDocJsonStr error',
      text: err.message || 'error',
    });
    reconnect();
    return 0;
  }
}

/**
 * Update doc binary content
 * @param {string} id doc id
 * @param {Buffer} binary doc binary content
 * @returns {Promise<number>} updated rowCount
 */
export async function updateDocBinary(id: string, binary: Buffer): Promise<number> {
  try {
    const sql = `update "Doc" set "contentBinary" = $1 where id = $2`;
    const values = [binary, id];
    const result = await pgClient.query(sql, values);
    return result.rowCount;
  } catch (err: any) {
    logger.error(err, 'hocuspocus db updateDocBinary error');
    sendEmail({
      subject: 'hocuspocus db updateDocBinary error',
      text: err.message || 'error',
    });
    reconnect();
    return 0;
  }
}

/**
 * Get doc object by id
 * @param {string} id doc id
 * @returns {Promise<any | null>} doc object or null
 */
export async function getDocById(id: string): Promise<any | null> {
  try {
    const sql = `select content, "contentBinary" from "Doc" where id = '${id}'`;
    const result = await pgClient.query(sql);
    return result.rows[0];
  } catch (err: any) {
    logger.error(err, 'hocuspocus db getDocById error');
    sendEmail({
      subject: 'hocuspocus db getDocById error',
      text: err.message || 'error',
    });
    reconnect();
    return null;
  }
}

/**
 * select one doc for monitor
 * @returns {Promise<any | null>} doc object or null
 */
export async function selectOneDocForMonitor(): Promise<any | null> {
  try {
    const sql = `select id from "Doc" limit 1`;
    const result = await pgClient.query(sql);
    return result.rows[0];
  } catch (err: any) {
    logger.error(err, 'hocuspocus db selectOneDocForMonitor error');
    reconnect();
    return null;
  }
}
