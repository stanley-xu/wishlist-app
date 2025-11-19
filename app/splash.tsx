import { useAuthContext } from "@/lib/auth";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.setOptions({
  // image: "./assets/images/splash-icon.png",
  duration: 500,
  fade: true,
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function SplashScreenController() {
  const { loading } = useAuthContext();

  if (!loading) {
    SplashScreen.hide();
  }

  return null;
}
