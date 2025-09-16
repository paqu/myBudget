// src/screens/LoginScreen.tsx
import React, { useState, useRef } from "react";
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

import FormTextInput from "../components/FormTextInput";
import FormButton from "../components/FormButton";
import Loading from "../components/Loading";

import { colors } from "../config/colors";
import { strings } from "../config/strings";
import { useAuth } from "../context/AuthProvider";
import { validateEmail, validatePassword } from "../utils";
import { AuthStackParamList } from "../types";

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn, authState } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    email: false,
    password: false,
  });

  const passwordInputRef = useRef<any>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = strings.EMAIL_REQUIRED;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = strings.PASSWORD_REQUIRED;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInputBlur = (field: keyof FormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleEmailSubmit = () => {
    passwordInputRef.current?.focus();
  };

  const handleLogin = async () => {
    // Mark all fields as touched
    setTouched({ email: true, password: true });

    if (!validateForm()) {
      return;
    }

    try {
      await signIn(formData.email, formData.password);
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      let errorMessage = "An error occurred during login";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later";
      }

      Alert.alert("Login Failed", errorMessage);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  const navigateToForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  if (authState.isLoading) {
    return <Loading />;
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
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>💰</Text>
          </View>
          <Text style={styles.appTitle}>myBudget</Text>
        </View>

        <View style={styles.form}>
          <FormTextInput
            title={strings.LOGIN_TITLE}
            value={formData.email}
            onChangeText={handleInputChange("email")}
            onSubmitEditing={handleEmailSubmit}
            onBlur={handleInputBlur("email")}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            error={touched.email ? errors.email : undefined}
            placeholder="Enter your email"
          />

          <FormTextInput
            ref={passwordInputRef}
            title={strings.PASSWORD_TITLE}
            value={formData.password}
            onChangeText={handleInputChange("password")}
            onBlur={handleInputBlur("password")}
            secureTextEntry={true}
            autoCapitalize="none"
            returnKeyType="done"
            error={touched.password ? errors.password : undefined}
            placeholder="Enter your password"
            onSubmitEditing={handleLogin}
          />

          <Text
            style={styles.forgotPassword}
            onPress={navigateToForgotPassword}
          >
            Forgot Password?
          </Text>

          <FormButton
            label={strings.LOGIN}
            onPress={handleLogin}
            disabled={
              !formData.email || !formData.password || authState.isLoading
            }
          />

          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={styles.signupLink} onPress={navigateToRegister}>
              Register Now
            </Text>
          </Text>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 48,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.DARK,
  },
  form: {
    width: "100%",
  },
  forgotPassword: {
    color: colors.GREEN,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
    marginTop: 8,
  },
  signupText: {
    fontSize: 14,
    color: colors.GRAY,
    textAlign: "center",
    marginTop: 24,
  },
  signupLink: {
    color: colors.GREEN,
    fontSize: 14,
    fontWeight: "500",
  },
});
