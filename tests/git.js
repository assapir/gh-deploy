'use strict'

const Git = require('../lib/git')
const { test } = require('tap')
const fs = require('fs/promises')

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

test('Git.clone clone the repo to default location and branch', async t => {
  await removeFolderIfExist()
  const repo = await Git.clone({ repository: 'https://github.com/assapir/gh-deploy' })
  t.ok(repo, 'mmmm, repo object should have been created :thinking:')
  const branch = await repo.getCurrentBranch()
  t.equal(branch.name(), 'refs/heads/main')
  const files = await fs.readdir('/tmp/gh-deploy')
  t.ok(files.includes('.git'), 'where the heck you cloned it to?!')
})



async function removeFolderIfExist () {
  try {
    if (await fs.stat('/tmp/gh-deploy')) {
      await fs.rmdir('/tmp/gh-deploy', {
        recursive: true
      })
    }
  } catch {
    // ignore that it doesn't exist
  }
}
