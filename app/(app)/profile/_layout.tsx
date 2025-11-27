import { IconButton } from "@/components/Button";
import { APP_CONFIG } from "@/config";
import { shareTokens } from "@/lib/api";
import { useAuthContext } from "@/lib/auth";
import { useBottomSheet } from "@/lib/hooks/useBottomSheet";
import { assert } from "@/lib/utils";
import { text } from "@/styles/tokens";
import { Stack } from "expo-router";
import { Menu, Share as ShareIcon } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Share } from "react-native";

const ShareButton = () => {
  const { profile, session } = useAuthContext();
  assert(
    profile && session,
    "ProfileLayout should be authenticated and have profile context"
  );
  const currentUser = session.user;

  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    try {
      setLoading(true);

      const { data: token, error: tokenError } = await shareTokens.findOrCreate(
        currentUser.id
      );

      // end of required network calls
      setLoading(false);

      if (tokenError || !token) {
        Alert.alert("Error", "Failed to generate share link");
        return;
      }

      const userName = profile.name || "My";
      const shareUrl = `${APP_CONFIG.WEB_URL}/profile/${currentUser.id}?share=${token}`;

      await Share.share({
        message: `Check out ${userName}'s wishlist!`,
        url: shareUrl,
        title: `${userName}'s Wishlist`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Failed to share wishlist");
    }
  };

  return (
    <IconButton onPress={handleShare} disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color={text.black} />
      ) : (
        <ShareIcon size={24} />
      )}
    </IconButton>
  );
};

const BottomSheetButton = () => {
  const { openBottomSheet } = useBottomSheet();

  return (
    <IconButton onPress={openBottomSheet}>
      <Menu size={24} />
    </IconButton>
  );
};

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerRight: () => <ShareButton />,
          headerLeft: () => <BottomSheetButton />,
        }}
      />
      <Stack.Screen
        name="[userId]"
        options={{
          headerShown: true,
          presentation: "card",
        }}
      />
    </Stack>
  );
}
