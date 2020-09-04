'use strict'

const fastify = require('fastify')

const mount = (server) => {
  if (!server) {
    throw new Error('oh my ho my, I can\'t do anything without a server!')
  }

  server.get('/ping', async (request, reply) => {
    reply.code(200)
    return { message: 'Thanks for checking on me!' }
  })

  server.get('*', function (request, reply) {
    reply.code(404)
    return { err: 'What are you trying to do? there is nothing here!' }
  })
}

const server = () => {
  const app = fastify({
    logger: {
      level: 'debug',
      prettyPrint: true
    },
    ignoreTrailingSlash: true
  })
  mount(app)

  return app
}

module.exports = server
