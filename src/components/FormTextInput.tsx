import React, { forwardRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps,
} from "react-native";
import { colors } from "../config/colors";

interface FormTextInputProps extends TextInputProps {
  title: string;
  error?: string;
}

export default forwardRef<TextInput, FormTextInputProps>(function FormTextInput(
  { error, title, ...otherProps },
  ref,
) {
  return (
    <View style={styles.container}>
      <Text style={styles.inputTitle}>{title}</Text>
      <TextInput
        ref={ref}
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={colors.GRAY}
        {...otherProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={[styles.border, error && styles.borderError]} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
  },
  inputTitle: {
    color: colors.GRAY,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    color: colors.DARK,
    fontSize: 16,
    borderWidth: 0,
  },
  inputError: {
    color: colors.TORCH_RED,
  },
  border: {
    borderBottomColor: colors.GRAY,
    borderBottomWidth: 1,
    marginTop: 4,
  },
  borderError: {
    borderBottomColor: colors.TORCH_RED,
  },
  errorText: {
    color: colors.TORCH_RED,
    fontSize: 12,
    marginTop: 4,
    minHeight: 16,
  },
});
