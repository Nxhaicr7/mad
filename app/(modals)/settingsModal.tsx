import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const SettingsModal = () => {
  const router = useRouter();

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Setting"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._15 }}
        />

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => router.push("/(modals)/expenseLimitWarningModal")}
          activeOpacity={0.8}
        >
          <Typo size={15} fontWeight={"500"}>
            Expense Limit Warning
          </Typo>

          <Icons.CaretRight
            size={verticalScale(18)}
            color={colors.white}
            weight="bold"
          />
        </TouchableOpacity>
      </View>
    </ModalWrapper>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.neutral700,
    borderRadius: radius._12,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._15,
  },
});
