import { StyleSheet } from "react-native";

import { Container, Text } from "@/components";

export default function AboutScreen() {
  return (
    <Container style={styles.container}>
      <Text>About screen</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
