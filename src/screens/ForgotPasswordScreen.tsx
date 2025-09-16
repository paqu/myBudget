// src/screens/ForgotPasswordScreen.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import FormTextInput from "../components/FormTextInput";
import FormButton from "../components/FormButton";

import { colors } from "../config/colors";
import { validateEmail } from "../utils";
import { AuthStackParamList } from "../types";

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "ForgotPassword"
>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    setEmailError(undefined);
    return true;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError(undefined);
    }
  };

  const handleResetPassword = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      Alert.alert(
        "Email Sent",
        "A password reset link has been sent to your email address. Please check your inbox and follow the instructions.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ],
      );
    } catch (error: any) {
      let errorMessage = "An error occurred while sending the reset email";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later";
      }

      Alert.alert("Reset Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Email Sent!</Text>
          <Text style={styles.successMessage}>
            We've sent a password reset link to {email}. Please check your inbox
            and follow the instructions.
          </Text>

          <FormButton
            label="Back to Login"
            onPress={navigateToLogin}
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Don't worry! Enter your email address and we'll send you a link to
            reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <FormTextInput
            title="Email Address"
            value={email}
            onChangeText={handleEmailChange}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="done"
            error={emailError}
            placeholder="Enter your email"
            onSubmitEditing={handleResetPassword}
          />

          <FormButton
            label={isLoading ? "Sending..." : "Send Reset Link"}
            onPress={handleResetPassword}
            disabled={!email || isLoading}
          />

          <FormButton
            label="Back to Login"
            onPress={navigateToLogin}
            variant="secondary"
            style={styles.secondaryButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.DARK,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.GRAY,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  secondaryButton: {
    marginTop: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.DARK,
    marginBottom: 16,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: colors.GRAY,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  backButton: {
    width: "100%",
  },
});
