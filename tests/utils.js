'use strict'

const { join, resolve } = require('path')
const os = require('os')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = async (dest = join(os.tmpdir(), 'gh-deploy')) => {
  await exec(`rm -rf ${resolve(dest)}`)
}
