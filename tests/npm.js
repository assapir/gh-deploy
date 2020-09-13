'use strict'

const npm = require('../lib/npm')
const { test, beforeEach, afterEach } = require('tap')
const Git = require('../lib/git')
const removeFolderIfExist = require('./utils')
const fs = require('fs').promises
const { join, resolve } = require('path')

beforeEach(async () => {
  await removeFolderIfExist('./tmp')
})

afterEach(async () => {
  await removeFolderIfExist('./tmp')
})

test('npm.install install node_modules to default location', async t => {
  const dest = resolve('./tmp') // that the default path
  await Git.clone({
    repository: 'https://github.com/npm/ci-detect.git',
    branch: 'master',
    destination: dest
  })

  await npm.install()
  t.resolves(async () => await fs.stat(join(dest, 'node_modules')))
})

test('npm.install install node_modules to specified location', async t => {
  const dest = resolve('./tmp/insider')
  await Git.clone({
    repository: 'https://github.com/npm/ci-detect.git',
    branch: 'master',
    destination: dest
  })

  await npm.install({ path: dest })
  t.resolves(async () => await fs.stat(join(dest, 'node_modules')))
})
