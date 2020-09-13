'use strict'

const Arborist = require('@npmcli/arborist')
const { resolve } = require('path')

const install = async options => {
  if (!options || !options.path) {
    options = { ...{ path: './tmp' } }
  }
  await new Arborist({ path: resolve(options.path), omit: ['dev'] }).reify()
}

module.exports = {
  install
}
