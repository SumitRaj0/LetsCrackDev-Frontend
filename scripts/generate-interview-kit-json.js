/* eslint-disable no-console */
/**
 * Generate backend Interview Kit JSON from the frontend TS source.
 * This avoids shipping the full question content in the frontend bundle.
 *
 * Usage:
 *   node scripts/generate-interview-kit-json.js
 */

const fs = require('fs')
const path = require('path')
const vm = require('vm')

const FRONTEND_SRC = path.join(
  __dirname,
  '..',
  'frontend',
  'src',
  'data',
  'interviewKit',
  'questions.ts',
)
const OUT_DIR = path.join(__dirname, '..', 'backend', 'src', 'modules', 'interviewKits', 'data')
const OUT_FILE = path.join(OUT_DIR, 'javascript-interview-mastery-kit.json')

function main() {
  const src = fs.readFileSync(FRONTEND_SRC, 'utf8')
  let code = src

  // Drop imports / exports and TS type annotations so we can eval as JS.
  // Frontend source uses ESM imports without semicolons.
  code = code.replace(/^import\s.+$/gm, '')
  code = code.replace(
    /export\s+const\s+interviewKitQuestions\s*:\s*InterviewQuestion\[\]\s*=\s*/g,
    'const interviewKitQuestions = ',
  )
  code = code.replace(/const\s+(question\d+)\s*:\s*InterviewQuestion\s*=\s*/g, 'const $1 = ')
  code = code.replace(/export\s+/g, '')

  // Wrap and evaluate.
  const wrapped = `(function(){\n${code}\n; return interviewKitQuestions; })()`
  const questions = vm.runInNewContext(wrapped, {}, { timeout: 2000 })

  if (!Array.isArray(questions) || questions.length < 50) {
    throw new Error(`Failed to extract questions array (got ${Array.isArray(questions) ? questions.length : typeof questions})`)
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(OUT_FILE, JSON.stringify(questions, null, 2), 'utf8')
  console.log(`Generated ${questions.length} questions -> ${OUT_FILE}`)
}

main()


