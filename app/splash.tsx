import { useAuthContext } from "@/lib/auth";
import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

/**
 * TODO: okay but how do I actually design this?
 */

export function SplashScreenController() {
  const { loading } = useAuthContext();

  if (!loading) {
    SplashScreen.hide();
  }

  return null;
}
