import { Text } from "@/components";
import { IconButton } from "@/components/Button";
import { avatarImage } from "@/lib/api";
import { borderRadius, colours, spacing, text } from "@/styles/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";

interface Props {
  size: number;
  url: string | null;
  onUpload?: (filePath: string) => void;
  fallbackText?: string;
}

export default function Avatar({
  url,
  size = 150,
  onUpload,
  fallbackText,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) loadImage(url);
  }, [url]);

  async function loadImage(path: string) {
    try {
      const { data, error } = await avatarImage.getByPath(path);

      if (error) throw error;
      if (!data) throw new Error("No data returned from avatar image");

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      console.error("Error loading image:", error);
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false,
        shape: "oval",
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.debug("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      console.debug("Got image", image);

      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      const { data, error } = await avatarImage.upload(
        image.uri,
        image.mimeType
      );

      if (error) throw error;
      if (!data) throw new Error("No data returned from avatar image upload");

      console.debug(`[uploadAvatar] data`);
      console.debug(data);

      onUpload?.(data.path);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View
      style={{
        position: "relative",
        height: size + spacing.lg, // Adding offsets for the upload button
        width: size + spacing.lg, // Adding offsets for the upload button
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]}>
          {fallbackText && (
            <Text
              variant="bold"
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ color: text.white, fontSize: size * 0.5 }}
            >
              {fallbackText}
            </Text>
          )}
        </View>
      )}
      {onUpload && (
        <View style={{ position: "absolute", bottom: 0, right: 0 }}>
          <IconButton
            onPress={uploadAvatar}
            loading={uploading}
            style={{ minWidth: 44 }}
          >
            <Ionicons
              name="add-circle-sharp"
              size={32}
              color={colours.accent}
            />
          </IconButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: borderRadius.full,
    overflow: "hidden",
    maxWidth: "100%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: colours.surfaceDark,
    justifyContent: "center",
    alignItems: "center",
  },
});
