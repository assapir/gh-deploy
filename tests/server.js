'use strict'

const server = require('../lib/server')
const { test } = require('tap')

test('GET /ping/ should return 200', async t => {
  const app = server()

  const response = await app.inject({
    method: 'GET',
    url: '/ping/'
  })

  t.equal(response.statusCode, 200)
  const body = JSON.parse(response.body)
  t.equal(body.message, 'Thanks for checking on me!')
})

test('GET /ping should also return 200', async t => {
  const app = server()

  const response = await app.inject({
    method: 'GET',
    url: '/ping'
  })

  t.equal(response.statusCode, 200)
  const body = JSON.parse(response.body)
  t.equal(body.message, 'Thanks for checking on me!')
})

test('GET / else should return 404', async t => {
  const app = server()

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  t.equal(response.statusCode, 404)
  const body = JSON.parse(response.body)
  t.equal(body.err, 'What are you trying to do? there is nothing here!')
})
