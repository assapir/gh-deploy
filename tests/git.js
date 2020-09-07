'use strict'

const Git = require('../lib/git')
const { test, afterEach } = require('tap')
const fs = require('fs').promises
const path = require('path')
const os = require('os')
const removeFolderIfExist = require('./utils')

afterEach(async () => {
  await removeFolderIfExist()
  const dest = path.join(os.tmpdir(), 'not-that-again')
  await removeFolderIfExist(dest)
})

test('Git.clone without repo throw error', async t => {
  t.rejects(async () => await Git.clone(),
    'I can\'t do anything without a valid repository, that start with https://github.com/')
})

test('Git.clone not from github throw error', async t => {
  t.rejects(async () => await Git.clone({
    repository: 'https://gitlab.com'
  }),
  'I can\'t do anything without a valid repository, that start with https://github.com/')
})

test('Git.clone clone the repo to default destination and branch', async t => {
  const dest = path.join(os.tmpdir(), 'gh-deploy')
  await removeFolderIfExist()

  const repo = await Git.clone({ repository: 'https://github.com/assapir/gh-deploy' })
  t.ok(repo, 'mmmm, repo object should have been created :thinking:')
  const branch = await repo.getCurrentBranch()
  t.equal(branch.name(), 'refs/heads/main')
  const files = await fs.readdir(dest)
  t.ok(files.includes('.git'), 'where the heck you cloned it to?!')
})

test('Git.clone clone the repo to default destination and specified branch', async t => {
  await removeFolderIfExist()

  const repo = await Git.clone({
    repository: 'https://github.com/assapir/gh-deploy',
    branch: 'ciBranch'
  })
  t.ok(repo, 'mmmm, repo object should have been created :thinking:')
  const branch = await repo.getCurrentBranch()
  t.equal(branch.name(), 'refs/heads/ciBranch')
})

test('Git.clone clone the repo to specified destination and specified branch', async t => {
  const dest = path.join(os.tmpdir(), 'not-that-again')
  await removeFolderIfExist(dest)

  const repo = await Git.clone({
    repository: 'https://github.com/assapir/gh-deploy',
    branch: 'ciBranch',
    destination: dest
  })
  t.ok(repo, 'mmmm, repo object should have been created :thinking:')
  const branch = await repo.getCurrentBranch()
  t.equal(branch.name(), 'refs/heads/ciBranch')
  t.resolves(async () => await fs.readdir(dest), 'this directory should have exist by now')
})

test('Git.open without repoPath throws error', async t => {
  t.rejects(async () => await Git.open({}),
    'I can\'t do anything without a repoPath')
})

test('Git.open specified destination with default branch when already in that branch', async t => {
  const dest = path.join(os.tmpdir(), 'not-that-again')
  await removeFolderIfExist(dest)

  let repo = await Git.clone({
    repository: 'https://github.com/assapir/gh-deploy',
    destination: dest
  })

  repo = await Git.open({
    repoPath: dest
  })
  t.ok(repo, 'mmmm, repo object should have been created :thinking:')
  const branch = await repo.getCurrentBranch()
  t.equal(branch.name(), 'refs/heads/main')
})

test('Git.open specified destination with specific branch when in other branch', async t => {
  const dest = path.join(os.tmpdir(), 'not-that-again')
  await removeFolderIfExist(dest)

  let repo = await Git.clone({
    repository: 'https://github.com/assapir/gh-deploy',
    destination: dest
  })

  repo = await Git.open({
    repoPath: dest,
    branch: 'ciBranch'
  })
  t.ok(repo, 'mmmm, repo object should have been created :thinking:')
  const branch = await repo.getCurrentBranch()
  t.equal(branch.name(), 'refs/heads/ciBranch')
})
