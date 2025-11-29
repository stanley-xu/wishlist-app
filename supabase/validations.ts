import { DB_CONFIG } from "@/config";
import { assert } from "@/lib/utils";
import z from "zod";

export default function validateSupabase() {
  // Use Constants.expoConfig.extra to read runtime env vars from app.config.js
  const supabaseUrl = DB_CONFIG.URL;
  const supabaseKey = DB_CONFIG.KEY;

  assert(
    supabaseUrl,
    `No expo constant for supabase URL. Check app config and environment variables.`
  );
  assert(
    supabaseKey,
    `No expo constant for supabase key. Check app config and environment variables.`
  );

  console.log("🔧 Supabase Client Config:", {
    url: supabaseUrl,
    hasKey: !!supabaseKey,
  });

  // Catch common placeholder values that indicate incomplete setup
  const invalidPatterns = ["REPLACE", "TODO", "CHANGEME"];

  // I've setup .env.template with stubbed URLs that should intentionally fail this if your environment isn't setup!
  const urlSchema = z.url();
  urlSchema.parse(supabaseUrl);
}
