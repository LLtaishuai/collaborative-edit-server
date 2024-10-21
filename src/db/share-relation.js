const { pgClient } = require('./client')

/**
 * Get share relation
 * @param {string} docId doc id
 * @param {string} userId user id
 * @returns {string | null} 'ADMIN' | 'READ' | 'WRITE' | null
 */
async function getShareRelationAccess(docId, userId) {
  try {
    // check if the doc is mine
    const getDocSQL = `select id from "Doc" where id = $1 and "userId" = $2`
    const getDocValues = [docId, userId]
    const getDocResult = await pgClient.query(getDocSQL, getDocValues)
    // console.log('getDocResult...', getDocResult.rowCount)
    if (getDocResult.rowCount > 0) {
      return 'ADMIN'
    }

    // If not mine, check share relation
    const getShareRelationSQL = `select * from "ShareRelation" where "docId" = $1 and "userId" = $2`
    const getShareRelationValues = [docId, userId]
    const getShareRelationResult = await pgClient.query(
      getShareRelationSQL,
      getShareRelationValues
    )
    // console.log('getShareRelationResult...', getShareRelationResult.rows[0])
    return getShareRelationResult.rows[0]?.access || null
  } catch (err) {
    console.error('hocuspocus db getShareRelationAccess error', err)
  }
}

module.exports = {
  getShareRelationAccess,
}
