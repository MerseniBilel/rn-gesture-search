import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";

interface PokemonSkeletonProps {
  count?: number;
}

export const PokemonSkeleton: React.FC<PokemonSkeletonProps> = ({ count = 1 }) => {
  const theme = useTheme();
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const renderSkeletonItem = () => (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.avatar, { backgroundColor: theme.colors.border }]} />
      <View style={styles.info}>
        <View style={[styles.name, { backgroundColor: theme.colors.border }]} />
        <View style={[styles.type, { backgroundColor: theme.colors.border }]} />
      </View>
    </Animated.View>
  );

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index}>
          {renderSkeletonItem()}
          {index < count - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  avatar: {
    
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    flex: 1,
    gap: 8,
  },
  name: {
    height: 16,
    borderRadius: 4,
    width: "60%",
  },
  type: {
    height: 12,
    borderRadius: 4,
    width: "40%",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(111, 111, 111, 0.2)",
    width: "85%",
    alignSelf: "flex-end",
  },
}); 