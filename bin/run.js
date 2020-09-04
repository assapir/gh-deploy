#!/usr/bin/env node

'use strict'

const server = require('../lib/server')
const logger = server.logger

process.on('uncaughtExceptionMonitor', (err, origin) => {
  logger.err(
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`
  )
})

const start = async (opts = {}) => {
  const app = server()
  const port = opts.port || 4538
  try {
    await app.listen(port)
  } catch (err) {
    logger.err(`Ho no! server failed to start, exiting. ${err}`)
    process.exit(1)
  }
}

start({
  port: process.env.PORT // will fallback to 4538
})
