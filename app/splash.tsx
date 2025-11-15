import { useAuthContext } from "@/lib/auth";
import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { loading } = useAuthContext();

  if (!loading) {
    SplashScreen.hide();
  }

  return null;
}
