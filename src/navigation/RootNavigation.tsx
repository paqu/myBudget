import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../context/AuthProvider";
import { RootStackParamList } from "../types";

import AuthNavigation from "./AuthNavigation";
import AppNavigation from "./AppNavigation";
import Loading from "../components/Loading";

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigation() {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "white" },
        }}
      >
        {authState.user ? (
          <Stack.Screen name="App" component={AppNavigation} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigation} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
