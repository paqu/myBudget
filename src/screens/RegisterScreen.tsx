// src/screens/RegisterScreen.tsx
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

type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Register"
>;

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { signUp, authState } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const emailInputRef = useRef<any>(null);
  const passwordInputRef = useRef<any>(null);
  const confirmPasswordInputRef = useRef<any>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = strings.NAME_REQUIRED;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    // Special handling for confirm password
    if (
      field === "password" &&
      formData.confirmPassword &&
      errors.confirmPassword
    ) {
      if (value === formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      }
    }

    if (
      field === "confirmPassword" &&
      formData.password &&
      errors.confirmPassword
    ) {
      if (value === formData.password) {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      }
    }
  };

  const handleInputBlur = (field: keyof FormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleNameSubmit = () => {
    emailInputRef.current?.focus();
  };

  const handleEmailSubmit = () => {
    passwordInputRef.current?.focus();
  };

  const handlePasswordSubmit = () => {
    confirmPasswordInputRef.current?.focus();
  };

  const handleRegister = async () => {
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!validateForm()) {
      return;
    }

    try {
      await signUp(formData.email, formData.password);
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      let errorMessage = "An error occurred during registration";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Registration is currently disabled";
      }

      Alert.alert("Registration Failed", errorMessage);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
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
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join myBudget to start managing your finances
          </Text>
        </View>

        <View style={styles.form}>
          <FormTextInput
            title={strings.NAME_TITLE}
            value={formData.name}
            onChangeText={handleInputChange("name")}
            onSubmitEditing={handleNameSubmit}
            onBlur={handleInputBlur("name")}
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="next"
            error={touched.name ? errors.name : undefined}
            placeholder="Enter your full name"
          />

          <FormTextInput
            ref={emailInputRef}
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
            onSubmitEditing={handlePasswordSubmit}
            onBlur={handleInputBlur("password")}
            secureTextEntry={true}
            autoCapitalize="none"
            returnKeyType="next"
            error={touched.password ? errors.password : undefined}
            placeholder="Choose a password"
          />

          <FormTextInput
            ref={confirmPasswordInputRef}
            title="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={handleInputChange("confirmPassword")}
            onBlur={handleInputBlur("confirmPassword")}
            secureTextEntry={true}
            autoCapitalize="none"
            returnKeyType="done"
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            placeholder="Confirm your password"
            onSubmitEditing={handleRegister}
          />

          <FormButton
            label={strings.SIGNUP}
            onPress={handleRegister}
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword ||
              authState.isLoading
            }
          />

          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink} onPress={navigateToLogin}>
              {strings.LOGIN}
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
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.DARK,
    marginBottom: 8,
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
  loginText: {
    fontSize: 14,
    color: colors.GRAY,
    textAlign: "center",
    marginTop: 24,
  },
  loginLink: {
    color: colors.GREEN,
    fontSize: 14,
    fontWeight: "500",
  },
});
