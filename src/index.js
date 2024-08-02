const Koa = require('koa')
const websocket = require('koa-easy-ws')
const Router = require('koa-router')
const { hocuspocusServer } = require('./hocuspocus')
const { connect } = require('./db/client')
require('dotenv').config()

const app = new Koa()

// Setup your koa instance using the koa-easy-ws extension
app.use(websocket())

const router = new Router()
router.get('/', async (ctx) => {
  ctx.body = 'huashuiAI colla server' //【注意】心跳检测 monitor 会检测这个字符串，不要随意修改！
})
router.get('/collaborate', async (ctx) => {
  if (ctx.ws) {
    const ws = await ctx.ws()

    hocuspocusServer.handleConnection(
      ws,
      ctx.request

      // // additional data (optional)
      // { user_id: 1234 }
    )
  } else {
    ctx.body = 'collaborate route'
  }
})
app.use(router.routes()).use(router.allowedMethods())

// Start the server
const port = parseInt(process.env.PORT, 10) || 1234
app.listen(port)

// Connect to the database
connect()
