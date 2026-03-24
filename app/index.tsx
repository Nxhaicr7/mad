import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/themeContext"; // Import hook theme

const Index = () => {
  const router = useRouter();
  const { colors } = useTheme(); // Lấy bảng màu động

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    // Dùng mảng [styles.container, { backgroundColor: ... }] để ghi đè màu nền tĩnh
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../assets/images/splashImage.png")}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },
  logo: {
    height: "20%",
    aspectRatio: 1,
  },
});