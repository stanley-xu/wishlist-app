/**
 * Supabase client for React Native
 *
 * IMPORTANT: The react-native-url-polyfill import MUST come first.
 * React Native doesn't have native URL/URLSearchParams APIs that Supabase requires.
 * Without this polyfill, all database queries will silently hang.
 *
 * See https://supabase.com/docs/guides/auth/quickstarts/with-expo-react-native-social-auth
 */

import "react-native-url-polyfill/auto";

// Verify the polyfill loaded correctly
console.log("🔍 Polyfill check:", {
  hasURL: typeof URL !== "undefined",
  hasURLSearchParams: typeof URLSearchParams !== "undefined",
});

if (typeof URL === "undefined" || typeof URLSearchParams === "undefined") {
  throw new Error(
    "❌ URL polyfill failed to load. Supabase requires react-native-url-polyfill. " +
      "Ensure it's installed and imported before @supabase/supabase-js."
  );
}

import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { Database } from "./database.types";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (value.length > 2048) {
      console.warn(
        "Value being stored in SecureStore is larger than 2048 bytes and it may not be stored successfully. In a future SDK version, this call may throw an error."
      );
    }
    return setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return deleteItemAsync(key);
  },
};

// Use Constants.expoConfig.extra to read runtime env vars from app.config.js
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? "";

// Validate Supabase configuration early
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "❌ Supabase configuration is missing!\n\n" +
      "Make sure you have set up your environment file (.env.local or .env.device)\n" +
      `Current URL: "${supabaseUrl}"\n` +
      `Has Key: ${!!supabaseAnonKey}`
  );
}

// Catch common placeholder values that indicate incomplete setup
const invalidPatterns = ["REPLACE", "TODO", "CHANGEME"];

const hasInvalidPattern = invalidPatterns.some((pattern) =>
  supabaseUrl.toLowerCase().includes(pattern.toLowerCase())
);

if (hasInvalidPattern) {
  throw new Error(
    "❌ Invalid Supabase URL detected!\n\n" +
      `Current URL: "${supabaseUrl}"\n\n` +
      "It looks like you haven't configured your .env.* file yet.\n" +
      "Please update LOCAL_IP to your actual machine's IP address.\n\n" +
      "To find your IP:\n" +
      "  - macOS: ifconfig | grep 'inet ' | grep -v 127.0.0.1\n" +
      "  - Linux: ip addr show | grep 'inet '\n" +
      "  - Windows: ipconfig\n\n" +
      "Then update .env.device:\n" +
      "  LOCAL_IP=192.168.1.XXX  # Replace with your actual IP"
  );
}

console.log("🔧 Supabase Client Config:", {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
});

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
