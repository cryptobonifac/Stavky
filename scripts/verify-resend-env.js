#!/usr/bin/env node

/**
 * Verification script for RESEND_API_KEY environment variable
 * 
 * Usage: node scripts/verify-resend-env.js
 * 
 * This script checks if RESEND_API_KEY is properly configured
 * and provides troubleshooting steps if it's not found.
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying RESEND_API_KEY configuration...\n')

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local')
const envLocalExists = fs.existsSync(envLocalPath)

console.log(`📁 .env.local file: ${envLocalExists ? '✅ Found' : '❌ Not found'}`)
console.log(`   Location: ${envLocalPath}\n`)

if (!envLocalExists) {
  console.log('❌ ISSUE: .env.local file does not exist!\n')
  console.log('📝 SOLUTION:')
  console.log('   1. Create .env.local in the project root (same level as package.json)')
  console.log('   2. Add the following line:')
  console.log('      RESEND_API_KEY=re_xxxxxxxxxxxxx')
  console.log('   3. Replace re_xxxxxxxxxxxxx with your actual Resend API key')
  console.log('   4. Restart your dev server (npm run dev)\n')
  process.exit(1)
}

// Read and check .env.local content
const envContent = fs.readFileSync(envLocalPath, 'utf8')
const lines = envContent.split('\n')

// Check for RESEND_API_KEY
let resendKeyLine = null
let resendKeyValue = null
let hasResendKey = false

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim()
  if (line.startsWith('RESEND_API_KEY')) {
    hasResendKey = true
    resendKeyLine = line
    const match = line.match(/RESEND_API_KEY\s*=\s*(.+)/)
    if (match) {
      resendKeyValue = match[1].trim()
      // Remove quotes if present
      if ((resendKeyValue.startsWith('"') && resendKeyValue.endsWith('"')) ||
          (resendKeyValue.startsWith("'") && resendKeyValue.endsWith("'"))) {
        resendKeyValue = resendKeyValue.slice(1, -1)
      }
    }
    break
  }
}

console.log(`🔑 RESEND_API_KEY variable: ${hasResendKey ? '✅ Found' : '❌ Not found'}`)

if (!hasResendKey) {
  console.log('\n❌ ISSUE: RESEND_API_KEY is not defined in .env.local\n')
  console.log('📝 SOLUTION:')
  console.log('   Add this line to .env.local:')
  console.log('   RESEND_API_KEY=re_xxxxxxxxxxxxx\n')
  process.exit(1)
}

// Check format
console.log(`   Line found: ${resendKeyLine}`)

const issues = []
if (!resendKeyValue || resendKeyValue === '') {
  issues.push('Value is empty')
} else {
  if (resendKeyValue.includes('"') || resendKeyValue.includes("'")) {
    issues.push('Value contains quotes (remove them)')
  }
  if (resendKeyLine.includes(' = ')) {
    issues.push('Spaces around = sign (remove them)')
  }
  if (!resendKeyValue.startsWith('re_')) {
    issues.push('Value does not start with "re_" (may be invalid)')
  }
  if (resendKeyValue.length < 20) {
    issues.push('Value seems too short (Resend keys are usually 40+ characters)')
  }
}

if (issues.length > 0) {
  console.log(`\n⚠️  FORMAT ISSUES DETECTED:`)
  issues.forEach(issue => console.log(`   - ${issue}`))
  console.log('\n📝 SOLUTION:')
  console.log('   Fix the format in .env.local:')
  console.log('   ❌ Wrong: RESEND_API_KEY="re_xxx"')
  console.log('   ❌ Wrong: RESEND_API_KEY = re_xxx')
  console.log('   ✅ Correct: RESEND_API_KEY=re_xxxxxxxxxxxxx')
  console.log('\n   Then restart your dev server: npm run dev\n')
  process.exit(1)
}

console.log(`   Value length: ${resendKeyValue.length} characters`)
console.log(`   Starts with "re_": ${resendKeyValue.startsWith('re_') ? '✅' : '❌'}`)

// Check if it's a placeholder
if (resendKeyValue.includes('xxxxx') || resendKeyValue === 'your_resend_api_key') {
  console.log('\n⚠️  WARNING: Value appears to be a placeholder')
  console.log('   Replace with your actual Resend API key from https://resend.com/api-keys\n')
  process.exit(1)
}

console.log('\n✅ RESEND_API_KEY is properly configured!')
console.log('\n📋 NEXT STEPS:')
console.log('   1. Make sure your dev server is running: npm run dev')
console.log('   2. If you just added/modified the variable, restart the server')
console.log('   3. Test the configuration: Visit http://localhost:3000/api/contact')
console.log('   4. You should see "resendConfigured": true in the response\n')

process.exit(0)


