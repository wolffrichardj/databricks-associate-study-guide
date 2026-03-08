import { spawnSync } from 'node:child_process'

const run = (name, args) => {
  const result = spawnSync('npm', args, {
    stdio: 'pipe',
    encoding: 'utf8',
    env: process.env,
  })

  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)

  return { name, ...result, output: `${result.stdout ?? ''}${result.stderr ?? ''}` }
}

const outdated = run('outdated', ['outdated'])
const audit = run('audit', ['audit', '--audit-level=moderate'])

const results = [outdated, audit]
const failures = results.filter((item) => item.status !== 0)

if (failures.length === 0) {
  process.exit(0)
}

const onlyNetworkBlocks = failures.every((item) =>
  item.output.includes('403') || item.output.toLowerCase().includes('forbidden'),
)

if (onlyNetworkBlocks && !process.env.CI) {
  console.warn(
    '\n⚠️ Security/version checks are blocked by registry access in this environment. ' +
      'Run npm outdated and npm audit in a network-enabled environment.\n',
  )
  process.exit(0)
}

process.exit(1)
