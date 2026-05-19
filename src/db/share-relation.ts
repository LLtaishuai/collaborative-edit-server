import { pgClient, reconnect } from './client.js';
import logger from '../lib/logger.js';

/**
 * Get share relation
 * @param {string} docId doc id
 * @param {string} userId user id
 * @returns {Promise<string | null>} 'ADMIN' | 'READ' | 'WRITE' | null
 */
export async function getShareRelationAccess(docId: string, userId: string): Promise<string | null> {
  try {
    // check if the doc is mine
    const getDocSQL = `select id from "Doc" where id = $1 and "userId" = $2`;
    const getDocValues = [docId, userId];
    const getDocResult = await pgClient.query(getDocSQL, getDocValues);
    
    if (getDocResult.rowCount > 0) {
      return 'ADMIN';
    }

    // If not mine, check share relation
    const getShareRelationSQL = `select * from "ShareRelation" where "docId" = $1 and "userId" = $2`;
    const getShareRelationValues = [docId, userId];
    const getShareRelationResult = await pgClient.query(
      getShareRelationSQL,
      getShareRelationValues
    );
    
    return getShareRelationResult.rows[0]?.access || null;
  } catch (err: any) {
    logger.error(err, 'hocuspocus db getShareRelationAccess error');
    reconnect();
    return null;
  }
}

/**
 * update share relation notice type to 'UPDATE'
 * @param {string} docId doc id
 * @param {string} userId user id
 */
export async function updateShareRelationNoticeType(docId: string, userId: string): Promise<void> {
  const sql = `update "ShareRelation" set "noticeType" = 'UPDATE' where "docId" = $1 and "userId" <> $2`;
  const values = [docId, userId];
  try {
    await pgClient.query(sql, values);
  } catch (err: any) {
    logger.error(err, 'hocuspocus db updateShareRelationNoticeType error');
    reconnect();
  }
}
