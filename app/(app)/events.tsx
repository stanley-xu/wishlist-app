import { ScrollView } from "react-native";

import { Text } from "@/components";
import { colours } from "@/styles/tokens";

export default function EventsScreen() {
  return (
    <ScrollView
      style={{ backgroundColor: colours.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{}}
    >
      <Text>Events</Text>
    </ScrollView>
  );
}
