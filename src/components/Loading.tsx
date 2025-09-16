import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../config/colors";

interface LoadingProps {
  size?: "small" | "large";
  color?: string;
}

export default function Loading({
  size = "large",
  color = colors.GREEN,
}: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
