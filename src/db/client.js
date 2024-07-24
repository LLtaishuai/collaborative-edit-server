const pg = require('pg')
require('dotenv').config()

const { Client } = pg
const url = process.env.DATABASE_URL

const pgClient = new Client(url)

pgClient.on('error', (err) => {
  console.error('pg connect db error ', err.stack)
})

async function connect() {
  await pgClient.connect()
  console.log('pg connect db success')
}

module.exports = { pgClient, connect }
