'use strict'

const npm = require('../lib/npm')
const { test, beforeEach } = require('tap')
const Git = require('../lib/git')
const removeFolderIfExist = require('./utils')
const fs = require('fs').promises
const { join, resolve } = require('path')

beforeEach(async () => {
  const dest = resolve('./tmp')
  await removeFolderIfExist(dest)
})

test('npm.install install node_modules to default location', async t => {
  const dest = resolve('./tmp') // that the default path
  await removeFolderIfExist(dest)
  await Git.clone({
    repository: 'https://github.com/assapir/gh-deploy',
    branch: 'main',
    destination: dest
  })

  await npm.install()
  t.resolves(async () => await fs.stat(join(dest, 'node_modules')))
})

test('npm.install install node_modules to specified location', async t => {
  const dest = resolve('./tmp/insider')
  await removeFolderIfExist(dest)
  await Git.clone({
    repository: 'https://github.com/assapir/gh-deploy',
    branch: 'main',
    destination: dest
  })

  await npm.install({ path: dest })
  t.resolves(async () => await fs.stat(join(dest, 'node_modules')))
})
