// src/screens/SettingsScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { colors } from "../config/colors";
import { useAuth } from "../context/AuthProvider";

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  destructive?: boolean;
}

function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  destructive = false,
}: SettingsItemProps) {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <View
          style={[
            styles.iconContainer,
            destructive && styles.iconContainerDestructive,
          ]}
        >
          <FontAwesome
            name={icon as any}
            size={20}
            color={destructive ? colors.WHITE : colors.GRAY}
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.settingsTitle,
              destructive && styles.settingsTitleDestructive,
            ]}
          >
            {title}
          </Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <FontAwesome name="chevron-right" size={16} color={colors.GRAY} />
      )}
    </TouchableOpacity>
  );
}

interface UserInfoProps {
  user: any;
}

function UserInfo({ user }: UserInfoProps) {
  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const formatEmail = (email: string) => {
    if (email.length > 25) {
      return email.slice(0, 22) + "...";
    }
    return email;
  };

  return (
    <View style={styles.userInfo}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {getInitials(user.email || "User")}
        </Text>
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{user.displayName || "User"}</Text>
        <Text style={styles.userEmail}>
          {formatEmail(user.email || "No email")}
        </Text>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { authState, signOut } = useAuth();

  const handleProfileEdit = () => {
    Alert.alert(
      "Coming Soon",
      "Profile editing will be available in a future update.",
    );
  };

  const handleNotificationSettings = () => {
    Alert.alert(
      "Coming Soon",
      "Notification settings will be available in a future update.",
    );
  };

  const handleCurrencySettings = () => {
    Alert.alert(
      "Coming Soon",
      "Currency settings will be available in a future update.",
    );
  };

  const handleExportData = () => {
    Alert.alert(
      "Coming Soon",
      "Data export will be available in a future update.",
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About myBudget",
      "myBudget v2.0\n\nA modern personal finance management app built with React Native and Expo.\n\n© 2024 myBudget Team",
    );
  };

  const handleSupport = () => {
    Alert.alert(
      "Support",
      "For support, please contact us at support@mybudget.app",
    );
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {authState.user && (
          <>
            <UserInfo user={authState.user} />
            <View style={styles.divider} />
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <SettingsItem
            icon="user"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={handleProfileEdit}
          />

          <SettingsItem
            icon="bell"
            title="Notifications"
            subtitle="Manage notification preferences"
            onPress={handleNotificationSettings}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <SettingsItem
            icon="money"
            title="Currency"
            subtitle="PLN - Polish Złoty"
            onPress={handleCurrencySettings}
          />

          <SettingsItem
            icon="download"
            title="Export Data"
            subtitle="Download your transaction data"
            onPress={handleExportData}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <SettingsItem
            icon="info-circle"
            title="About"
            subtitle="App version and information"
            onPress={handleAbout}
          />

          <SettingsItem
            icon="question-circle"
            title="Help & Support"
            subtitle="Get help or contact support"
            onPress={handleSupport}
          />
        </View>

        <View style={styles.section}>
          <SettingsItem
            icon="sign-out"
            title="Sign Out"
            onPress={handleSignOut}
            showArrow={false}
            destructive={true}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>myBudget v2.0</Text>
          <Text style={styles.footerSubtext}>
            Built with ❤️ using React Native
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: colors.WHITE,
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.DARK,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.WHITE,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    color: colors.WHITE,
    fontSize: 20,
    fontWeight: "600",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.DARK,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.GRAY,
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.DARK,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.WHITE,
    padding: 16,
    marginVertical: 2,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconContainerDestructive: {
    backgroundColor: colors.TORCH_RED,
  },
  textContainer: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.DARK,
    marginBottom: 2,
  },
  settingsTitleDestructive: {
    color: colors.TORCH_RED,
  },
  settingsSubtitle: {
    fontSize: 12,
    color: colors.GRAY,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
    marginTop: 16,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.GRAY,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.GRAY,
  },
});
