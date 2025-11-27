const envFile = process.env.ENV || "local";
require("dotenv").config({
  path: `.env.${envFile}`,
  override: true,
  quiet: true,
});

export default {
  expo: {
    name: "giftful",
    slug: "giftful",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/giftful.icon",
    scheme: "giftful",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    platforms: ["ios"],
    ios: {
      icon: "./assets/giftful.icon",
      bundleIdentifier: "io.giftful",
      associatedDomains: ["applinks:giftful.io", "applinks:www.giftful.io"],
      supportsTablet: true,
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-secure-store",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // Make env vars available via expo-constants
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      webUrl: process.env.EXPO_PUBLIC_WEB_URL || "https://giftful.io",
      eas: {
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
      },
    },
  },
};
