import { useAuthContext } from "@/lib/auth";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";

SplashScreen.setOptions({
  // image: "./assets/images/splash-icon.png",
  duration: 500,
  fade: true,
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function SplashScreenController() {
  const { loading } = useAuthContext();
  // Added to prevent uncaught errors in register flow
  const hasHidden = useRef(false);

  useEffect(() => {
    if (!loading && !hasHidden.current) {
      hasHidden.current = true;
      SplashScreen.hideAsync().catch((error) => {
        console.warn("Error hiding splash screen:", error);
      });
    }
  }, [loading]);

  return null;
}
