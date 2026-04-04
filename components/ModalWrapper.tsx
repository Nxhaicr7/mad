import { spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/themeContext";

const isIos = Platform.OS == "ios";

const ModalWrapper = ({
    style,
    children,
    bg,
}: ModalWrapperProps) => {
    const { colors } = useTheme();


    const fallbackBg = bg || colors.background;

    return (
        <View style={[styles.container, { backgroundColor: fallbackBg }, style && style]}>
            {children}
        </View>
    );
};

export default ModalWrapper;

const styles = StyleSheet.create({
    container: {
        flex: 1,

        paddingTop: isIos ? spacingY._15 : (StatusBar.currentHeight || 0) + 10,
        paddingBottom: isIos ? spacingY._20 : spacingY._10,
    },
});