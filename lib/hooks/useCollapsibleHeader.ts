import { useCallback, useState } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TIMING_CONFIG = { duration: 300 };

interface UseCollapsibleHeaderParams {
  cardHeight: number;
  initialExpanded?: boolean;
}

export function useCollapsibleHeader({
  cardHeight,
  initialExpanded = false
}: UseCollapsibleHeaderParams) {
  const EXPANDED_POSITION = 0;
  const COLLAPSED_POSITION = -cardHeight;
  const SNAP_THRESHOLD = COLLAPSED_POSITION * 0.5;

  const translateY = useSharedValue(initialExpanded ? EXPANDED_POSITION : COLLAPSED_POSITION);
  const context = useSharedValue({ y: 0 });
  const chevronRotation = useSharedValue(initialExpanded ? -180 : 0);
  const [isCollapsed, setIsCollapsed] = useState(!initialExpanded);

  const updateCollapseState = (collapsed: boolean) => {
    "worklet";
    runOnJS(setIsCollapsed)(collapsed);
    chevronRotation.value = withTiming(collapsed ? 0 : -180);
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(
        COLLAPSED_POSITION,
        Math.min(EXPANDED_POSITION, context.value.y + event.translationY)
      );
    })
    .onEnd((event) => {
      if (event.velocityY > 500) {
        translateY.value = withTiming(EXPANDED_POSITION, TIMING_CONFIG);
        updateCollapseState(false);
      } else if (event.velocityY < -500) {
        translateY.value = withTiming(COLLAPSED_POSITION, TIMING_CONFIG);
        updateCollapseState(true);
      } else {
        if (translateY.value > SNAP_THRESHOLD) {
          translateY.value = withTiming(EXPANDED_POSITION, TIMING_CONFIG);
          updateCollapseState(false);
        } else {
          translateY.value = withTiming(COLLAPSED_POSITION, TIMING_CONFIG);
          updateCollapseState(true);
        }
      }
    });

  const animatedProfileCardStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [COLLAPSED_POSITION + 100, COLLAPSED_POSITION],
      [1, 0]
    );
    return {
      transform: [{ translateY: translateY.value }],
      opacity,
    };
  });

  const animatedSpacerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      translateY.value,
      [COLLAPSED_POSITION, EXPANDED_POSITION],
      [0, cardHeight]
    );
    return {
      height,
    };
  });

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${chevronRotation.value}deg` }],
    };
  });

  const toggleExpand = useCallback(() => {
    const target = isCollapsed ? EXPANDED_POSITION : COLLAPSED_POSITION;
    translateY.value = withTiming(target, TIMING_CONFIG);
    // Directly call the worklet-compatible function
    updateCollapseState(!isCollapsed);
  }, [isCollapsed, translateY, EXPANDED_POSITION, COLLAPSED_POSITION]);

  return {
    gesture,
    animatedProfileCardStyle,
    animatedSpacerStyle,
    animatedChevronStyle,
    toggleExpand,
    isCollapsed,
  };
}
