import { View } from "react-native";

import { Text } from "@/components";
import { colours } from "@/styles/tokens";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colours.surface,
      }}
    >
      <Ionicons name="sync-circle-outline" size={96} color="black" />
      <Text>Loading...</Text>
    </View>
  );
}
