// src/navigation/AppNavigation.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "../config/colors";
import { AppTabParamList } from "../types";

import ReportsScreen from "../screens/ReportsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TransactionsNavigation from "./TransactionsNavigation";

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === "Reports") {
            iconName = "bar-chart";
          } else if (route.name === "Transactions") {
            iconName = "exchange";
          } else if (route.name === "Settings") {
            iconName = "user-circle";
          } else {
            iconName = "question";
          }

          return (
            <FontAwesome name={iconName as any} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: colors.GREEN,
        tabBarInactiveTintColor: colors.GRAY,
        tabBarStyle: {
          backgroundColor: colors.WHITE,
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarLabel: "Reports",
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsNavigation}
        options={{
          tabBarLabel: "Transactions",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
        }}
      />
    </Tab.Navigator>
  );
}
