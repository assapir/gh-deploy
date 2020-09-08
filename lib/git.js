'use strict'

const nodegit = require('nodegit')
const path = require('path')
const os = require('os')

const clone = async options => {
  let { repository, destination, branch = 'main' } = options
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

const open = async options => {
  const { repoPath, branch = 'main' } = options
  if (!repoPath) {
    throw new Error('I can\'t do anything without a repoPath')
  }

  const destination = path.resolve(repoPath)
  const repo = await nodegit.Repository.open(destination)
  const currentBranch = await repo.getCurrentBranch()
  if (currentBranch.name().endsWith(branch)) {
    // we are already in the right branch, all good!
    return repo
  }
  try {
    await repo.checkoutBranch(branch)
  } catch (e) {
    // https://github.com/nodegit/nodegit/blob/master/examples/checkout-remote-branch.js
    if (!e.message.startsWith('no reference found for shorthand')) {
      throw e
    }
    await checkoutBranch(repo, branch)
  }
  return repo
}

const checkout = async options => {
  const { repoObj, hash } = options
  if (!repoObj || !hash) {
    throw new Error('how do you expect me to know what to do? repoObj should be come from "open" or "clone"')
  }

  const fullSHA = await nodegit.AnnotatedCommit.fromRevspec(repoObj, hash)
  const oid = await nodegit.Oid.fromString(fullSHA.id().toString())
  const commit = await repoObj.getCommit(oid)
  await nodegit.Checkout.tree(repoObj, commit)
}

module.exports = {
  clone,
  open,
  checkout
}

const checkoutBranch = async (repo, branch) => {
  const headCommit = await repo.getHeadCommit()
  const ref = await repo.createBranch(branch, headCommit, false)
  await repo.checkoutBranch(ref)
  const remoteCommit = await repo.getReferenceCommit(`refs/remotes/origin/${branch}`)
  nodegit.Reset.reset(repo, remoteCommit, nodegit.Reset.TYPE.HARD)
}
