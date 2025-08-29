const fs = require('fs')
const path = require('path')

const registryPath = path.resolve(__dirname, '../src/data/pollsRegistry.ts')
const votesPath = path.resolve(__dirname, '../data/polls.json')

function readVotes() {
  const raw = fs.readFileSync(votesPath, 'utf8')
  return JSON.parse(raw).votes || {}
}

function readRegistryIds() {
  const raw = fs.readFileSync(registryPath, 'utf8')
  const idMatches = [...raw.matchAll(/id:\s*"([a-zA-Z0-9_\-]+)"/g)]
  return new Set(idMatches.map(m => m[1]))
}

function main() {
  const votes = readVotes()
  const ids = readRegistryIds()

  const voteKeys = Object.keys(votes)
  const unmatched = voteKeys.filter(k => !ids.has(k))

  console.log('Total vote keys:', voteKeys.length)
  console.log('Total registry ids:', ids.size)
  if (unmatched.length === 0) {
    console.log('All vote keys map to registry ids.')
  } else {
    console.log('Unmatched vote keys:')
    unmatched.forEach(k => console.log(' -', k))
  }
}

main()
