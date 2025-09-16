import React from "react";
import { StyleSheet } from "react-native";

import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { store } from "../store/store";
import { AuthProvider } from "../context/AuthProvider";
import RootNavigation from "./RootNavigation";

export default function NavigationProvider() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AuthProvider>
            <RootNavigation />
            <StatusBar style="auto" />
          </AuthProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
