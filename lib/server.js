const Fastify = require('fastify')

const mount = (server) => {
  if (!server) {
    throw new Error('oh my ho my, I can\'t do anything without a server!')
  }

  server.get('/ping', async (request, reply) => {
    reply.code(200)
    return 'Thanks for checking on me!'
  })

  server.get('*', function (request, reply) {
    reply.code(404)
    return { err: 'What are you trying to do? there is nothing here!'}
  })
}

const start = async (opts) => {
  const server = Fastify({
    logger: {
      level: 'debug'
    }
  })
  mount(server)

  opts = opts || {}
  const port = opts.port || 4538
  try {
    await server.listen(port)
    return server
  } catch (err) {
    server.logger.err(`Ho no! server failed to start, exiting. ${err}`)
    process.exit(1)
  }
}

module.exports = { start }
