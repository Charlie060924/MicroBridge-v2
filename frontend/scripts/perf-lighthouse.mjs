#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const PAGES = [
  {
    name: 'candidates',
    url: 'http://localhost:3000/employer_portal/workspace/candidates'
  },
  {
    name: 'student-dashboard',
    url: 'http://localhost:3000/student_portal/workspace'
  },
  {
    name: 'settings',
    url: 'http://localhost:3000/student_portal/workspace/settings'
  }
];

const DEVICES = ['mobile', 'desktop'];

async function runLighthouse(page, device) {
  const outputPath = `perf/reports/baseline/${page.name}-${device}.json`;
  
  try {
    console.log(`🔍 Running Lighthouse for ${page.name} (${device})...`);
    
    const command = [
      'npx lighthouse',
      page.url,
      `--output=json`,
      `--output-path=${outputPath}`,
      `--chrome-flags="--headless --no-sandbox --disable-gpu"`,
      device === 'mobile' ? '--preset=perf' : '--preset=perf'
    ].join(' ');
    
    execSync(command, { stdio: 'inherit' });
    
    console.log(`✅ Lighthouse report saved to ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`❌ Failed to run Lighthouse for ${page.name} (${device}):`, error.message);
    return null;
  }
}

async function main() {
  // Create reports directory
  const reportsDir = 'perf/reports/baseline';
  mkdirSync(reportsDir, { recursive: true });
  
  console.log('🚀 Starting Lighthouse performance audit...\n');
  
  const results = [];
  
  for (const page of PAGES) {
    for (const device of DEVICES) {
      const result = await runLighthouse(page, device);
      if (result) {
        results.push(result);
      }
    }
  }
  
  // Generate summary
  const summary = {
    timestamp: new Date().toISOString(),
    reports: results,
    pages: PAGES.map(p => p.name),
    devices: DEVICES
  };
  
  writeFileSync(
    join(reportsDir, 'summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  console.log('\n📊 Performance audit complete!');
  console.log(`📁 Reports saved to: ${reportsDir}`);
  console.log(`📋 Summary: ${join(reportsDir, 'summary.json')}`);
  
  // Check if dev server is running
  try {
    execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'ignore' });
    console.log('\n💡 Make sure your dev server is running: npm run dev');
  } catch {
    console.log('\n⚠️  Dev server not running. Start with: npm run dev');
  }
}

main().catch(console.error);


