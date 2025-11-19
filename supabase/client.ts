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
  hasURLSearchParams: typeof URLSearchParams !== "undefined"
});

if (typeof URL === "undefined" || typeof URLSearchParams === "undefined") {
  throw new Error(
    "❌ URL polyfill failed to load. Supabase requires react-native-url-polyfill. " +
    "Ensure it's installed and imported before @supabase/supabase-js."
  );
}

import { createClient } from "@supabase/supabase-js";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import Constants from "expo-constants";
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

console.log("🔧 Supabase Client Config:", {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
});

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: ExpoSecureStoreAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
