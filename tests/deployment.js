'use strict'

const {
  Deployment,
  NoDeploymentYetError,
  DeploymentStatuses
} = require('../lib/deployment')
const { test } = require('tap')
const nock = require('nock')

test('new should throw if it doesn\'t have all the params', async t => {
  const token = 'nice-token-dude'
  const owner = 'me'
  const repo = 'gh-deploy'
  const environment = 'prod-on-friday'
  t.throws(() => new Deployment({ owner, repo, environment }), 'well, I need this params...')
  t.throws(() => new Deployment({ token, repo, environment }), 'well, I need this params...')
  t.throws(() => new Deployment({ token, owner, environment }), 'well, I need this params...')
  t.throws(() => new Deployment({ token, owner, repo }), 'well, I need this params...')
})

test('Cannot get id before deploying', async t => {
  const opts = {
    token: 'nice-token-dude',
    owner: 'me',
    repo: 'gh-deploy',
    environment: 'prod-on-friday'
  }

  const deployment = new Deployment(opts)
  t.throws(() => deployment.id, new NoDeploymentYetError('One have to create a deployment first, using createNewDeployment method!'))
})

test('createNewDeployment call GitHub endpoint with right default options', async t => {
  const opts = {
    token: 'nice-token-dude',
    owner: 'me',
    repo: 'gh-deploy',
    environment: 'prod-on-friday'
  }
  const gitHubScope = nock('https://api.github.com')
    .post(`/repos/${opts.owner}/${opts.repo}/deployments`, {
      ref: 'refs/heads/master',
      environment: 'prod-on-friday'
    })
    .reply(201, {
      id: 1
    })

  const deployment = new Deployment(opts)
  await deployment.createNewDeployment()
  gitHubScope.done()
  t.equals(deployment.id, 1)
})

test('createNewDeployment call GitHub endpoint with actor and not default branch', async t => {
  const opts = {
    token: 'nice-token-dude',
    owner: 'me',
    repo: 'gh-deploy',
    environment: 'prod-on-friday'
  }
  const actor = 'nice person'
  const ref = 'refs/heads/main'
  const gitHubScope = nock('https://api.github.com')
    .post(`/repos/${opts.owner}/${opts.repo}/deployments`, {
      ref,
      environment: 'prod-on-friday',
      payload: {
        actor
      }
    })
    .reply(201, {
      id: 4
    })

  const deployment = new Deployment(opts)
  await deployment.createNewDeployment({ actor, ref })
  gitHubScope.done()
  t.equals(deployment.id, 4)
})

test('updateDeploymentStatus fail without status', async t => {
  const opts = {
    token: 'nice-token-dude',
    owner: 'me',
    repo: 'gh-deploy',
    environment: 'prod-on-friday'
  }

  const gitHubScope = nock('https://api.github.com')
  gitHubScope.post(`/repos/${opts.owner}/${opts.repo}/deployments`, {
    ref: 'refs/heads/master',
    environment: 'prod-on-friday'
  })
    .reply(201, {
      id: 1
    })

  const deployment = new Deployment(opts)
  await deployment.createNewDeployment()
  gitHubScope.done()
  t.rejects(async () => await deployment.updateDeploymentStatus(), new Error('I need to know what state to set the deployment to...'))
})

test('updateDeploymentStatus call GitHub endpoint with right default options', async t => {
  const opts = {
    token: 'nice-token-dude',
    owner: 'me',
    repo: 'gh-deploy',
    environment: 'prod-on-friday'
  }

  const gitHubScope = nock('https://api.github.com')
  gitHubScope.post(`/repos/${opts.owner}/${opts.repo}/deployments`, {
    ref: 'refs/heads/master',
    environment: 'prod-on-friday'
  })
    .reply(201, {
      id: 1
    })

  const state = DeploymentStatuses.ERROR
  gitHubScope.post(`/repos/${opts.owner}/${opts.repo}/deployments/1/statuses`, {
    state: 'error'
  })
    .reply(201, {
      id: 1,
      state: 'error'
    })

  const deployment = new Deployment(opts)
  await deployment.createNewDeployment()
  await deployment.updateDeploymentStatus(state)
  gitHubScope.done()
  t.equals(deployment.id, 1)
})
