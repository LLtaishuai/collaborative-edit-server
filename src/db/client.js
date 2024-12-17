const pg = require('pg')
const { sendEmail } = require('../lib/mailer')
require('dotenv').config()
const debounce = require('lodash.debounce')

const { Client } = pg
const url = process.env.DATABASE_URL

let pgClient = new Client(url)

pgClient.on('error', (err) => {
  console.error('pg connect db error ', err.stack)

  sendEmail({
    subject: 'hocuspocus pg connect db error',
    text: err.message || 'error',
  })
})

async function connect() {
  await pgClient.connect()
  console.log('pg connect db success')
}

const reconnect = debounce(async () => {
  console.log('pg will reconnect...')
  pgClient = null
  await connect()
}, 3 * 1000)

module.exports = { pgClient, connect, reconnect }
