const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Precheck script to verify Docker (Colima) and Supabase are running
// Note: this only works on @stanley-xu's dev machine!

const projectRoot = path.resolve(__dirname, "..");

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
  } catch {
    return null;
  }
}

// Check if Colima is running
const colimaStatus = run("colima status 2>&1");
if (!colimaStatus || !colimaStatus.toLowerCase().includes("is running")) {
  console.error("❌ Colima is not running");
  console.error("   Start it with: colima start");
  process.exit(1);
}

// Check if Docker daemon is accessible
if (!run("docker info")) {
  console.error("❌ Docker daemon is not accessible");
  console.error("   Try: colima start");
  process.exit(1);
}

// Check if Supabase containers are running
const containers = run("docker ps --format '{{.Names}}'");
if (!containers || !containers.includes("supabase")) {
  console.error("❌ Supabase containers are not running");
  console.error("   Start them with: npm run db:start");
  process.exit(1);
}

console.log("✅ Colima and Supabase are ready");

// Update IP address in .env.local
const envPath = path.join(projectRoot, ".env.local");

if (!fs.existsSync(envPath)) {
  console.error(`\n❌ ${envPath} not found. Copy from .env.template first.\n`);
  process.exit(1);
}

const currentIp = run("ipconfig getifaddr en0")?.trim();

if (!currentIp) {
  console.error(
    "\n❌ Could not detect IP address. Are you connected to WiFi?\n"
  );
  process.exit(1);
}

let env = fs.readFileSync(envPath, "utf8");
// Match both quoted and unquoted: EXPO_PUBLIC_SUPABASE_URL=http://... or ="http://..."
const ipRegex = /EXPO_PUBLIC_SUPABASE_URL="?http:\/\/([^:"\s]+):54321"?/;
const match = env.match(ipRegex);

if (match && match[1] !== currentIp) {
  env = env.replace(
    ipRegex,
    `EXPO_PUBLIC_SUPABASE_URL=http://${currentIp}:54321`
  );
  fs.writeFileSync(envPath, env);
  console.log(`✅ Updated IP: ${currentIp}`);
} else if (match) {
  console.log(`✅ IP is current: ${currentIp}`);
} else {
  console.error(`❌ Could not find EXPO_PUBLIC_SUPABASE_URL in ${envPath}`);
  process.exit(1);
}
