import { View } from "react-native";

import { colours } from "@/styles/tokens";
import { LoaderCircle } from "lucide-react-native";

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
      {/* TODO rotate animation */}
      <LoaderCircle size={96} />
    </View>
  );
}
