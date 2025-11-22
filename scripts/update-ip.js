const { execSync } = require('child_process');
const fs = require('fs');

const envPath = '.env.device';

if (!fs.existsSync(envPath)) {
  console.error(`\n❌ ${envPath} not found. Copy from .env.template first.\n`);
  process.exit(1);
}

const currentIp = execSync('ipconfig getifaddr en0').toString().trim();

if (!currentIp) {
  console.error('\n❌ Could not detect IP address. Are you connected to WiFi?\n');
  process.exit(1);
}

let env = fs.readFileSync(envPath, 'utf8');

env = env.replace(/LOCAL_IP="[^"]*"/, `LOCAL_IP="${currentIp}"`);
env = env.replace(
  /EXPO_PUBLIC_SUPABASE_URL="[^"]*"/,
  `EXPO_PUBLIC_SUPABASE_URL="http://${currentIp}:54321"`
);

fs.writeFileSync(envPath, env);
console.log(`✅ Updated ${envPath} with IP: ${currentIp}`);
