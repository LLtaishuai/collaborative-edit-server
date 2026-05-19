import { Server } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
import { Database } from '@hocuspocus/extension-database';
import { TiptapTransformer } from '@hocuspocus/transformer';
import * as Y from 'yjs';
import { basicExts } from './exts.js';
import { updateDocJsonStr, updateDocBinary, getDocById } from '../db/doc.js';
import { decryptToken } from '../lib/token.js';
import {
  getShareRelationAccess,
  // updateShareRelationNoticeType,
} from '../db/share-relation.js';
import logger from '../lib/logger.js';

// on store document
async function onStoreDocument(data: any) {
  const documentName = data.documentName;

  // update doc json content
  const json = TiptapTransformer.fromYdoc(data.document, 'default');
  const jsonStr = JSON.stringify(json);
  const rowCount = await updateDocJsonStr(documentName, jsonStr);
  logger.info({ documentName, rowCount }, 'hocuspocus onStoreDocument updated');

  // update share relation notice type to 'UPDATE'
  // const context = data.context || {};
  // await updateShareRelationNoticeType(documentName, context.userId);
}

// on db fetch doc
async function dbFetch({ documentName }: { documentName: string }) {
  const res = await getDocById(documentName);
  if (!res) return null;
  
  logger.info({ documentName, fields: Object.keys(res) }, 'Fetch db fetch res');
  
  if (res.contentBinary) return res.contentBinary; // return binary content if exists
  if (res.content == null) return null;
  
  try {
    const bytes = TiptapTransformer.toYdoc(
      JSON.parse(res.content),
      'default',
      basicExts
    ); // JSON to Yjs doc
    const state = Y.encodeStateAsUpdate(bytes); // Yjs doc to binary
    return state;
  } catch (err: any) {
    logger.error(err, 'hocuspocus transform toYdoc error');
  }
  return null;
}

// on db store doc
async function dbStore({ documentName, state }: { documentName: string, state: Buffer }) {
  const rowCount = await updateDocBinary(documentName, state);
  logger.info({ documentName, rowCount }, 'hocuspocus db store updated');
}

// on authenticate
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onAuthenticate(data: any) {
  const { documentName, token } = data;
  if (!token) throw new Error('Token is required');

  const info = decryptToken(token);
  if (!info) throw new Error('Token is invalid or expired');

  const access = await getShareRelationAccess(documentName, info.userId);
  logger.info({ documentName, access }, 'hocuspocus onAuthenticate access');
  
  if (access == null) throw new Error('You do not have access to this document');
  if (access == 'READ') {
    data.connection.readOnly = true;
  }

  return {
    userId: info.userId,
  };
}

export const hocuspocusServer = Server.configure({
  // onAuthenticate,
  onStoreDocument,
  extensions: [
    new Logger(),
    new Database({
      fetch: dbFetch, // fetch doc content from db
      store: dbStore, // store doc contentBinary to db
    }),
  ],
});
