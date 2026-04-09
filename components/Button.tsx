import Loading from "@/components/Loading";
import { radius } from "@/constants/theme";
import { CustomButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/contexts/themeContext";

const Button = ({
    style,
    onPress,
    loading = false,
    children,
}: CustomButtonProps) => {
    const { colors } = useTheme();

    if (loading) {
        return (
            <View style={[styles.button, { backgroundColor: 'transparent' }, style]}>
                <Loading color={colors.primary} />
            </View>
        )
    }
    return (
        <TouchableOpacity
            onPress={onPress}

            style={[styles.button, { backgroundColor: colors.primary }, style]}
        >
            {children}
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {

        borderRadius: radius._17,
        borderCurve: "continuous",
        height: verticalScale(52),
        justifyContent: "center",
        alignItems: "center",
    },
});