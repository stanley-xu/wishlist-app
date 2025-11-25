import { View } from "react-native";

import { colours } from "@/styles/tokens";
import { LoaderCircle } from "lucide-react-native";
import { useAnimatedStyle } from "react-native-reanimated";

export default function LoadingScreen() {
  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `360deg 1000ms ease-in-out infinite` }],
    };
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colours.surface,
      }}
    >
      {/* TODO rotate animation */}
      <LoaderCircle size={96} style={animationStyle} />
    </View>
  );
}
