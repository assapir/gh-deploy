'use strict'

const nodegit = require('nodegit')
const path = require('path')
const os = require('os')

const clone = async ({ repository, destination, branch = 'main' }) => {
  if (!repository || !repository.startsWith('https://github.com/')) {
    throw new Error('I can\'t do anything without a valid repository, that start with https://github.com/')
  }

  if (!destination) {
    const repoName = repository.split('/').pop()
    destination = path.join(os.tmpdir(), repoName)
  }
  const repo = await nodegit.Clone(repository, destination, {
    checkoutBranch: branch
  })
  return repo
}

const open = async ({ repoPath, branch = 'main' }) => {
  if (repoPath) {
    throw new Error('I can\'t do anything without a repository')
  }

  const destination = path.resolve(repoPath)
  const repo = await nodegit.Repository.open(destination)
  await repo.checkoutBranch(branch)
  return repo
}

module.exports = {
  clone,
  open
}
