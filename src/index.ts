import Koa from 'koa';
// @ts-ignore
import websocket from 'koa-easy-ws';
import Router from '@koa/router';
import { hocuspocusServer } from './hocuspocus/index.js';
import { connect } from './db/client.js';
import { selectOneDocForMonitor } from './db/doc.js';
import { env } from './env.js';
import logger from './lib/logger.js';

const app = new Koa();

// Setup your koa instance using the koa-easy-ws extension
// @ts-ignore
app.use(websocket());

const router = new Router();
router.get('/', async (ctx) => {
  ctx.body = 'huashuiAI colla server';
});

//【注意】心跳检测 monitor 会检测，不要随意修改！
router.get('/selectOneDoc', async (ctx) => {
  const doc = await selectOneDocForMonitor();
  ctx.body = doc; // 格式如 {"id":"xxxx"}
});

router.get('/collaborate', async (ctx) => {
  // @ts-ignore
  if (ctx.ws) {
    // @ts-ignore
    const ws = await ctx.ws();

    hocuspocusServer.handleConnection(
      ws,
      ctx.req
      // // additional data (optional)
      // { user_id: 1234 }
    );
  } else {
    ctx.body = 'collaborate route';
  }
});

app.use(router.routes()).use(router.allowedMethods());

// Start the server
const port = env.PORT;
app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});

// Connect to the database
connect();
