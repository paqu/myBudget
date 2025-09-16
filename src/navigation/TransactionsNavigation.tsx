import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TransactionsScreen from "../screens/TransactionsScreen";
import TransactionDetailsScreen from "../screens/TransactionDetailsScreen";
import { TransactionsStackParamList } from "../types";
import { colors } from "../config/colors";

const Stack = createStackNavigator<TransactionsStackParamList>();

export default function TransactionsNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="TransactionsList"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.WHITE,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#e0e0e0",
        },
        headerTintColor: colors.GREEN,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
        //headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="TransactionsList"
        component={TransactionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetailsScreen}
        options={({ route }) => ({
          title: route.params?.title || "Transaction Details",
        })}
      />
    </Stack.Navigator>
  );
}
