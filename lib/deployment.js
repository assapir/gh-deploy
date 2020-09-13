'use strict'

const { Octokit } = require('@octokit/rest')

const DeploymentStatuses = Object.freeze({
  ERROR: Symbol.for('error'),
  FAILURE: Symbol.for('failure'),
  INACTIVE: Symbol.for('inactive'),
  IN_PROGRESS: Symbol.for('in_progress'),
  QUEUED: Symbol.for('queued'),
  PENDING: Symbol.for('pending'),
  SUCCESS: Symbol.for('success')
})

const NoDeploymentYetError = class extends Error {
  constructor (...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoDeploymentYetError)
    }
  }
}

const Deployment = class {
  constructor ({ token, owner, repo, environment } = {}) {
    if (!token || !owner || !repo || !environment) {
      throw new Error('well, I need this params...')
    }
    this.octokit = new Octokit({
      auth: token,
      previews: ['ant-man-preview', 'flash-preview']
    })
    this.owner = owner
    this.repo = repo
    this.environment = environment
  }

  get id () {
    if (!this.deploymentId) {
      throw new NoDeploymentYetError('One have to create a deployment first, using createNewDeployment method!')
    }

    return this.deploymentId
  }

  async createNewDeployment (options = {}) {
    const { ref = 'refs/heads/master', actor } = options
    let payload
    if (actor) {
      payload = { actor }
    }

    const deployOption = {
      owner: this.owner,
      repo: this.repo,
      ref,
      environment: this.environment,
      payload
    }

    const response = await this.octokit.repos.createDeployment(deployOption)
    this.deploymentId = response.data.id
  }

  async updateDeploymentStatus (state) {
    if (!state) {
      throw new Error('I need to know what state to set the deployment to...')
    }

    await this.octokit.repos.createDeploymentStatus({
      owner: this.owner,
      repo: this.repo,
      deployment_id: this.id, // that should throw if no deployment was created
      state: Symbol.keyFor(state)
    })
  }
}

module.exports = {
  Deployment,
  NoDeploymentYetError,
  DeploymentStatuses
}
