const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = envFile.split(/\r?\n/).reduce((acc, line) => {
  const m = line.match(/^(.*?)=(.*)$/);
  if (m) {
    acc[m[1]] = m[2].replace(/^"|"$/g, '');
  }
  return acc;
}, {});

console.log('Using DATABASE_URL:', env.DATABASE_URL ? env.DATABASE_URL.replace(/(.*:\/\/).*@/, '$1***@') : 'undefined');

execSync('npm run db:push', {
  cwd: path.resolve(__dirname, '..'),
  env: { ...process.env, ...env },
  stdio: 'inherit',
});
