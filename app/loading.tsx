import { Loader } from "@/components";
import { colours } from "@/styles/tokens";
import { View } from "react-native";

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
      <Loader />
    </View>
  );
}
