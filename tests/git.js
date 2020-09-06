'use strict'

const Git = require('../lib/git')
const { test } = require('tap')
const fs = require('fs').promises

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

test('Git.clone clone the repo to default destinaiton and branch', async t => {
  await removeFolderIfExist()
  const repo = await Git.clone({ repository: 'https://github.com/assapir/gh-deploy' })
  t.ok(repo, 'mmmm, repo object should have been created :thinking:')
  const branch = await repo.getCurrentBranch()
  t.equal(branch.name(), 'refs/heads/main')
  const files = await fs.readdir('/tmp/gh-deploy')
  t.ok(files.includes('.git'), 'where the heck you cloned it to?!')
})

test('Git.clone clone the repo to default destinaiton and specified branch', async t => {
  await removeFolderIfExist()
  const repo = await Git.clone({
    repository: 'https://github.com/assapir/gh-deploy',
    branch: 'ciBranch'
  })
  t.ok(repo, 'mmmm, repo object should have been created :thinking:')
  const branch = await repo.getCurrentBranch()
  t.equal(branch.name(), 'refs/heads/ciBranch')
})

test('Git.clone clone the repo to specified destinaiton and specified branch', async t => {
  const path = '/tmp/not-that-again'
  await removeFolderIfExist(path)
  const repo = await Git.clone({
    repository: 'https://github.com/assapir/gh-deploy',
    branch: 'ciBranch',
    destination: path
  })
  t.ok(repo, 'mmmm, repo object should have been created :thinking:')
  const branch = await repo.getCurrentBranch()
  t.equal(branch.name(), 'refs/heads/ciBranch')
  t.resolves(async () => await fs.readdir(path), 'this directory should have exist by now')
})

test('Git.open without repoPath throws error', async t => {
  t.rejects(async () => await Git.open({}),
    'I can\'t do anything without a repoPath')
})

test('Git.open specified destinaiton with default branch when already in that branch', async t => {
  const path = '/tmp/not-that-again'
  await removeFolderIfExist(path)

  let repo = await Git.clone({
    repository: 'https://github.com/assapir/gh-deploy',
    destination: path
  })

  repo = await Git.open({
    repoPath: path
  })
  t.ok(repo, 'mmmm, repo object should have been created :thinking:')
  const branch = await repo.getCurrentBranch()
  t.equal(branch.name(), 'refs/heads/main')
})

test('Git.open specified destinaiton with specific branch when in other branch', async t => {
  const path = '/tmp/not-that-again'
  await removeFolderIfExist()

  let repo = await Git.clone({
    repository: 'https://github.com/assapir/gh-deploy'
  })

  repo = await Git.open({
    repoPath: path,
    branch: 'ciBranch'
  })
  t.ok(repo, 'mmmm, repo object should have been created :thinking:')
  const branch = await repo.getCurrentBranch()
  t.equal(branch.name(), 'refs/heads/ciBranch')
})

const removeFolderIfExist = async (path = '/tmp/gh-deploy') => {
  try {
    if (await fs.stat(path)) {
      await fs.rmdir(path, {
        recursive: true
      })
    }
  } catch {
    // ignore that it doesn't exist
  }
}
