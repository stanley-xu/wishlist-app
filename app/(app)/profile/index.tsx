import { ScrollView, StyleSheet, View } from "react-native";

import { Card } from "@/components";
import Avatar from "@/components/Avatar/Avatar";
import { profiles } from "@/lib/api";
import { useAuthContext } from "@/lib/auth";
import { borderRadius, colours, spacing } from "@/styles/tokens";
import { useState } from "react";

export default function ProfileScreen() {
  const { profile } = useAuthContext();
  if (!profile) {
    throw new Error("[Panic] rendering ProfileScreen without a profile");
  }

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile.avatar_url ?? null
  );
  const abbreviatedName = profile.name
    .split(" ")
    .map((name) => name[0].toUpperCase())
    .join("");

  const profileCardSection = (
    <Card
      variant="elevated"
      corners="squared"
      style={{
        borderBottomStartRadius: borderRadius.lg,
        borderBottomEndRadius: borderRadius.lg,
      }}
    >
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Avatar
            url={avatarUrl}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              profiles.updateProfile({ avatar_url: url });
            }}
            fallbackText={abbreviatedName}
          />
        </View>
        <View style={styles.profileName}>
          <Card.Title>{profile?.name}</Card.Title>
        </View>
        <Card.Text variant="italic">
          {/* TODO: add user bio */}
          {profile?.bio}
        </Card.Text>
      </View>
    </Card>
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      {profileCardSection}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.background,
  },
  profileHeader: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileAvatar: {
    marginBottom: spacing.md,
  },
  profileName: {},
});
