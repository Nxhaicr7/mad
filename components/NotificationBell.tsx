import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const NotificationBell = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push("/(modals)/notificationModal" as any)}
      style={styles.container}
      activeOpacity={0.85}
    >
      <Icons.Bell
        size={verticalScale(18)}
        color={colors.neutral200}
        weight="fill"
      />
    </TouchableOpacity>
  );
};

export default NotificationBell;

const styles = StyleSheet.create({
  container: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderRadius: radius._20,
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._10,
  },
});
