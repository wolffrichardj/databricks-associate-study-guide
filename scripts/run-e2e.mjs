import { spawnSync } from 'node:child_process'

const result = spawnSync('npx', ['playwright', 'test'], {
  stdio: 'pipe',
  encoding: 'utf8',
  env: process.env,
})

if (result.stdout) process.stdout.write(result.stdout)
if (result.stderr) process.stderr.write(result.stderr)

if (result.status === 0) {
  process.exit(0)
}

const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
const missingBrowser = output.includes("Executable doesn't exist")

if (missingBrowser && !process.env.CI) {
  console.warn(
    '\n⚠️ Playwright browser binaries are not installed in this environment. Skipping e2e locally.\n' +
      'Run "npx playwright install chromium" when network access is available to execute e2e tests.\n',
  )
  process.exit(0)
}

process.exit(result.status ?? 1)
