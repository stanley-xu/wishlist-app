import Constants from "expo-constants";

/**
 * App configuration constants
 */

export const APP_CONFIG = {
  /**
   * The web URL for the app - used for sharing and deep linking
   * Falls back to production URL if not set in environment
   */
  WEB_URL: (Constants.expoConfig?.extra?.webUrl ||
    "https://giftful.io") as string,

  /**
   * Custom URL scheme for deep linking
   * If scheme is an array, use the first one
   */
  SCHEME: (() => {
    const scheme = Constants.expoConfig?.scheme;
    if (Array.isArray(scheme)) {
      return scheme[0] || "giftful";
    }
    return scheme || "giftful";
  })(),
} as const;

export const DB_CONFIG = {
  URL: Constants.expoConfig?.extra?.supabaseUrl,
  KEY: Constants.expoConfig?.extra?.supabaseKey,
};
