import { spawnSync } from 'node:child_process'

const mode = process.argv[2]
const branch =
  process.env.WORKERS_CI_BRANCH ??
  process.env.GITHUB_REF_NAME ??
  process.env.BRANCH_NAME ??
  ''

function stop(message) {
  console.error(`\nDeployment blocked: ${message}\n`)
  process.exit(1)
}

if (!['production', 'preview'].includes(mode)) {
  stop('expected "production" or "preview" mode')
}

if (mode === 'production' && branch && branch !== 'main') {
  stop(`branch "${branch}" cannot deploy the production website; merge it into main first`)
}

if (mode === 'preview' && branch === 'main') {
  stop('main is reserved for production deployments')
}

let wranglerArgs

if (mode === 'production') {
  wranglerArgs = ['wrangler', 'deploy', '--env', 'production']
} else if (branch === 'dev') {
  // The shared dev branch owns the fixed dev.znye6302.com environment.
  wranglerArgs = ['wrangler', 'deploy', '--env', 'dev']
} else {
  // Feature branches get isolated ephemeral preview versions.
  wranglerArgs = ['wrangler', 'versions', 'upload']
}

console.log(`Deploy mode: ${mode}; branch: ${branch || '(unknown)'}`)
console.log(`Running: npx ${wranglerArgs.join(' ')}`)

const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const result = spawnSync(npxCommand, wranglerArgs, { stdio: 'inherit' })

if (result.error) {
  console.error(result.error)
  process.exit(1)
}

process.exit(result.status ?? 1)
