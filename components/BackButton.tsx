import { radius } from "@/constants/theme";
import { BackButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/themeContext";

const BackButton = ({ style, iconSize = 26 }: BackButtonProps) => {
    const router = useRouter();
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            onPress={() => router.back()}
            style={[
                styles.button,
                { backgroundColor: colors.neutral200 },
                style
            ]}
        >
            <CaretLeft
                size={verticalScale(iconSize)}
                color={colors.text}
                weight="bold"
            />
        </TouchableOpacity>
    );
};

export default BackButton;

const styles = StyleSheet.create({
    button: {
        alignSelf: "flex-start",
        borderRadius: radius._12,
        borderCurve: "continuous",
        padding: 5,
    },
});