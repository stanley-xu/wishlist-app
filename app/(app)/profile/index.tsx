import { Image, ScrollView, StyleSheet, View } from "react-native";

import { Card } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { borderRadius, colours, palette, spacing } from "@/styles/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ProfileScreen() {
  const { profile } = useAuthContext();

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
        <View style={[styles.profileAvatar, { position: "relative" }]}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile?.avatar_url }} />
          ) : (
            <Ionicons
              name="person-outline"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
              }}
            />
          )}
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
    width: 150,
    height: 150,
    borderRadius: borderRadius.full,
    backgroundColor: palette.white,
    marginBottom: spacing.md,
  },
  profileName: {},
});
