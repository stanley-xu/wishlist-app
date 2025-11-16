import { StyleSheet, View } from "react-native";

import { Text } from "@/components";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
