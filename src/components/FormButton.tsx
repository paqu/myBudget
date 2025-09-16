import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../config/colors";

interface FormButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function FormButton({
  label,
  onPress,
  disabled = false,
  variant = "primary",
  style,
  textStyle,
}: FormButtonProps) {
  const containerStyle = [
    styles.container,
    variant === "primary" ? styles.primaryContainer : styles.secondaryContainer,
    disabled && styles.containerDisabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    variant === "primary" ? styles.primaryText : styles.secondaryText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={buttonTextStyle}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 16,
    shadowColor: "rgba(108, 189, 126, 0.24)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryContainer: {
    backgroundColor: colors.GREEN,
  },
  secondaryContainer: {
    backgroundColor: colors.WHITE,
    borderWidth: 2,
    borderColor: colors.GREEN,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  primaryText: {
    color: colors.WHITE,
  },
  secondaryText: {
    color: colors.GREEN,
  },
});
