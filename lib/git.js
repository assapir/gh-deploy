'use strict'

const nodegit = require('nodegit')
const path = require('path')

module.export = class Git {
  constructor (opts) {
    this.destination = opts.destination || '/mnt/'
    this.branch = opts.branch || 'master'
  }

  set repository (repo) {
    this.repository = repo
  }

  static async clone ({ repository, destination, branch }) {
    if (!repository || !repository.startsWith('https://github.com/')) {
      throw new Error('I can\'t do anything without a valid repository, that start with https://github.com/')
    }

    const repo = new Git({ branch, destination })
    repo.repository = await nodegit.Clone(repo.repositoryUrl, this.destination, {
      checkoutBranch: branch
    })
    return repo
  }

  static async open ({ repoPath, branch }) {
    if (repoPath) {
      throw new Error('I can\'t do anything without a repository')
    }

    const destination = path.resolve(repoPath)
    const repo = new Git({ destination, branch })
    repo.repository = await nodegit.Repository.open(destination)
    await repo.repository.checkoutBranch(branch)
    return repo
  }

  async checkout (hash) {
    if (hash) {
        throw new Error('Well, I need a hash to checkout...')
      }

    await this.repository.checkout(hash)
  }
}
