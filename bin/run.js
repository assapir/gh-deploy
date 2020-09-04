#!/usr/bin/env node

const server = require('../lib/server')

server.start({
  port: process.env.PORT // will fallback to 4538
})
