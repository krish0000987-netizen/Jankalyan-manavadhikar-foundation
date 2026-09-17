import { execSync } from 'child_process';
import fs from 'fs';

let token = process.env.VERCEL_TOKEN;
if (!token && fs.existsSync('.env.local')) {
  const match = fs.readFileSync('.env.local', 'utf8').match(/VERCEL_TOKEN=["']?([^"'\r\n]+)/);
  if (match) token = match[1];
}

if (!token) {
  console.error('No VERCEL_TOKEN found in .env.local');
  process.exit(1);
}

console.log('Starting Vercel Production Deployment...');
try {
  const output = execSync(`npx -y vercel --prod --token "${token}" --yes`, {
    stdio: 'inherit',
    env: { ...process.env, VERCEL_TOKEN: token }
  });
  console.log('Deployment finished successfully.');
} catch (err) {
  console.error('Deployment error:', err.message);
  process.exit(1);
}
