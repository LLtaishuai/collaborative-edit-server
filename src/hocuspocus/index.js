const { Server } = require('@hocuspocus/server')
const { Logger } = require('@hocuspocus/extension-logger')
const { Database } = require('@hocuspocus/extension-database')
const { TiptapTransformer } = require('@hocuspocus/transformer')
const Y = require('yjs')
const { basicExts } = require('./exts')
const { updateDocJsonStr, updateDocBinary, getDocById } = require('../db/doc')
const { decryptToken } = require('../lib/token')
const { getShareRelationAccess } = require('../db/share-relation')

// on store document
async function onStoreDocument(data) {
  const documentName = data.documentName
  const json = TiptapTransformer.fromYdoc(data.document, 'default')
  // console.log('hocuspocus onStoreDocument .... ', data.documentName, json)
  const jsonStr = JSON.stringify(json)
  const rowCount = await updateDocJsonStr(documentName, jsonStr)
  console.log('hocuspocus onStoreDocument updated rowCount: ', rowCount)
}

// on db fetch doc
async function dbFetch({ documentName }) {
  // console.log('Fetch db fetch ... ', documentName)
  const res = await getDocById(documentName)
  console.log('Fetch db fetch res ... ', documentName, Object.keys(res))
  if (res == null) return null
  if (res.contentBinary) return res.contentBinary // return binary content if exists
  if (res.content == null) return null
  try {
    // console.log('hocuspocus db fetch res.content ...', res.content)
    // console.log('basicExts....', basicExts)
    const bytes = TiptapTransformer.toYdoc(
      JSON.parse(res.content),
      'default',
      basicExts
    ) // JSON to Yjs doc
    // console.log('hocuspocus db fetch bytes ...', bytes)
    const state = Y.encodeStateAsUpdate(bytes) // Yjs doc to binary
    // console.log('hocuspocus db fetch state ...... ', state)
    return state
  } catch (err) {
    console.log('hocuspocus transform toYdoc error ...', err)
  }
  return null
}

// on db store doc
async function dbStore({ documentName, state }) {
  // console.log('hocuspocus db store ... ', documentName, state)
  const rowContent = await updateDocBinary(documentName, state)
  console.log('hocuspocus db store updated rowCount: ', rowContent)
}

// on authenticate
async function onAuthenticate(data) {
  const { documentName, token } = data
  if (token == null || !token) throw new Error('Token is required')

  const info = decryptToken(token)
  if (info == null) throw new Error('Token is invalid or expired')
  // console.log('hocuspocus onAuthenticate info ... ', info)

  const access = await getShareRelationAccess(documentName, info.userId)
  console.log('hocuspocus onAuthenticate access ... ', access)
  if (access == null) throw new Error('You do not have access to this document')
  if (access == 'READ') {
    data.connection.readOnly = true
  }

  return {
    userId: info.userId,
  }
}

const hocuspocusServer = Server.configure({
  onAuthenticate,
  onStoreDocument,
  extensions: [
    new Logger(),
    new Database({
      fetch: dbFetch, // fetch doc content from db
      store: dbStore, // store doc contentBinary to db
    }),
  ],
})

module.exports = { hocuspocusServer }
