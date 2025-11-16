import { Redirect, useNavigation } from "expo-router";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";

import { Button, Card } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { borderRadius, colours, palette } from "@/styles/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect } from "react";

export default function ProfileScreen() {
  const { session } = useAuthContext();
  const user = session?.user;

  if (!user) {
    console.error(`User not found for session: ${session?.user?.id}`);
    console.log("Redirecting to login");
    return <Redirect href="/(auth)/login" />;
  }

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          variant="unstyled"
          size="sm"
          onPress={() => Alert.alert("Share pressed")}
        >
          <Ionicons name="share-outline" size={24} color={palette.white} />
        </Button>
      ),
    });
  }, [navigation]);

  const profileCardSection = (
    <View style={styles.profileHeader}>
      {/* TODO landscape background image */}
      <View style={styles.profileAvatar}>
        <Image source={{ uri: user.user_metadata.avatar_url }} />
      </View>
      <View style={styles.profileName}>
        <Card.Title>{user.email}</Card.Title>
      </View>
      <Card.Text variant="italic">
        {/* TODO: add user bio */}
        The quick brown fox jumps over the lazy dog
      </Card.Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Card variant="elevated" corners="squared" style={styles.card}>
        {profileCardSection}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.primary1,
  },
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  card: {
    flex: 1,
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
  },
  profileName: {},
});
