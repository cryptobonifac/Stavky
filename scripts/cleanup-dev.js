#!/usr/bin/env node

/**
 * Cleanup script to remove Next.js lock files and kill any running dev servers
 * Usage: node scripts/cleanup-dev.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Cleaning up development environment...\n');

// Remove Next.js lock file
const lockPath = path.join(process.cwd(), '.next', 'dev', 'lock');
if (fs.existsSync(lockPath)) {
  try {
    fs.unlinkSync(lockPath);
    console.log('✅ Removed Next.js lock file');
  } catch (error) {
    console.log('⚠️  Could not remove lock file (may be locked by running process)');
    console.log('   Try manually killing the process using port 3000');
  }
} else {
  console.log('ℹ️  No lock file found');
}

// Try to find and kill processes on port 3000
try {
  console.log('\n🔍 Checking for processes on port 3000...');
  
  // Windows command to find process using port 3000
  const netstatOutput = execSync('netstat -ano | findstr :3000', { encoding: 'utf8', stdio: 'pipe' });
  
  if (netstatOutput.trim()) {
    const lines = netstatOutput.trim().split('\n');
    const pids = new Set();
    
    lines.forEach(line => {
      const match = line.match(/\s+(\d+)\s*$/);
      if (match) {
        pids.add(match[1]);
      }
    });
    
    if (pids.size > 0) {
      console.log(`⚠️  Found ${pids.size} process(es) using port 3000:`);
      pids.forEach(pid => {
        try {
          const processInfo = execSync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, { encoding: 'utf8' });
          console.log(`   PID ${pid}: ${processInfo.split(',')[0].replace(/"/g, '')}`);
        } catch (e) {
          console.log(`   PID ${pid}: (unknown)`);
        }
      });
      console.log('\n💡 To kill these processes, run:');
      pids.forEach(pid => {
        console.log(`   taskkill /PID ${pid} /F`);
      });
    } else {
      console.log('✅ No processes found on port 3000');
    }
  } else {
    console.log('✅ No processes found on port 3000');
  }
} catch (error) {
  // netstat might not find anything, which is fine
  console.log('✅ Port 3000 appears to be free');
}

console.log('\n✨ Cleanup complete!');
console.log('💡 You can now run: npm run dev:with-webhooks\n');







