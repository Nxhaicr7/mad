import { ScreenWrapperProps } from "@/types";
import React from "react";
import {
  Dimensions,
  Platform,
  StatusBar, // Đảm bảo đã import StatusBar
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "@/contexts/themeContext";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {

  let paddingTop = Platform.OS == "ios" ? height * 0.06 : StatusBar.currentHeight;


  const { colors, isDarkMode } = useTheme();

  return (
    <View
      style={[
        {
          paddingTop, // Khoảng trống này sẽ đẩy toàn bộ nội dung xuống dưới
          flex: 1,
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});