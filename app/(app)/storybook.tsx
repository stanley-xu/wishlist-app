import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

export default function StorybookScreen() {
  const [StorybookUI, setStorybookUI] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Dynamically import Storybook only when this screen is mounted
    import("@/.rnstorybook").then((module) => {
      setStorybookUI(() => module.default);
    });
  }, []);

  if (!StorybookUI) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <StorybookUI />;
}
