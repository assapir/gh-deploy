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
    repo.repository = await nodegit.Clone(repo.repositoryUrl, this.destination)
  }

  static async open ({ repoPath, branch }) {
    const destination = path.resolve(repoPath)
    const repo = new Git({ destination, branch })
    repo.repository = await nodegit.Repository.open(destination)
  }
}
