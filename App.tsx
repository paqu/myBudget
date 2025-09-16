import React from "react";
import { LogBox } from "react-native";
import NavigationProvider from "./src/navigation";

// Ignore specific warnings (optional)
LogBox.ignoreLogs([
  "Warning: AsyncStorage has been extracted from react-native",
  "Warning: componentWillReceiveProps has been renamed",
  "Remote debugger", // Firebase warnings
]);

export default function App() {
  return <NavigationProvider />;
}
