import { AuthProvider } from "@/contexts/authContext";
import { ThemeProvider } from "@/contexts/themeContext"; // 1. IMPORT THÊM DÒNG NÀY
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(modals)/profileModal"
        options={{
          presentation: "modal"
        }}
      />
      <Stack.Screen
        name="(modals)/walletModal"
        options={{
          presentation: "modal",
        }}
      />
      {/* 2. THÊM ROUTE CHO SETTINGS MODAL VÀO ĐÂY */}
      <Stack.Screen
        name="(modals)/settingsModal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* 3. BỌC THEMEPROVIDER QUANH GIAO DIỆN APP */}
      <ThemeProvider>
        <StackLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});