import { useNavigation } from "expo-router";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Button, Card, Text } from "@/components";
import { useAuthContext } from "@/lib/auth";
import { borderRadius, colours, palette, spacing } from "@/styles/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect } from "react";

export default function ProfileScreen() {
  const { session } = useAuthContext();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          variant="unstyled"
          size="sm"
          // TODO: implement
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
    <FlatList
      ListHeaderComponent={
        <Card variant="elevated" corners="squared" style={styles.card}>
          {profileCardSection}
        </Card>
      }
      data={Array(12)
        .fill(null)
        .map((_, index) => ({ id: index }))}
      renderItem={({ item }) => <Item item={item} />}
    />
  );
}

const Item = ({ item }: { item: { id: number } }) => (
  <TouchableOpacity style={styles.item}>
    <Text>{item.id}</Text>
  </TouchableOpacity>
);

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
  item: {
    backgroundColor: palette.offwhite,
    minHeight: 52,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
});
