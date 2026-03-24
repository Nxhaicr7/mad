import { radius } from "@/constants/theme"; // Bỏ import colors tĩnh
import { BackButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/themeContext"; // Thêm hook theme

const BackButton = ({ style, iconSize = 26 }: BackButtonProps) => {
    const router = useRouter();
    const { colors } = useTheme(); // Lấy màu động

    return (
        <TouchableOpacity
            onPress={() => router.back()}
            style={[
                styles.button,
                { backgroundColor: colors.neutral200 }, // Nền nút nhẹ nhàng theo theme
                style
            ]}
        >
            <CaretLeft
                size={verticalScale(iconSize)}
                color={colors.text} // Icon đổi sang đen/trắng tùy chế độ
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