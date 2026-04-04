import Typo from "@/components/Typo";
import { radius, spacingX, spacingY } from "@/constants/theme";
import { scale } from "@/utils/styling";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/themeContext";
type Props = {
    icon: React.ReactNode;
    label: string;
    value: string;
};

const ScanResultItem = ({ icon, label, value }: Props) => {
    const { colors, isDarkMode } = useTheme();

    return (
        <View style={[
            styles.container,
            { backgroundColor: colors.surface }
        ]}>
            <View style={[
                styles.iconBox,

                { backgroundColor: isDarkMode ? colors.neutral700 : colors.neutral200 }
            ]}>
                {icon}
            </View>
            <View style={styles.textBox}>
                <Typo size={12} color={colors.textLight}>
                    {label}
                </Typo>
                <Typo size={14} fontWeight="500" color={colors.text}>
                    {value}
                </Typo>
            </View>
        </View>
    );
};

export default ScanResultItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._12,

        borderRadius: radius._12,
        padding: spacingY._12,
    },
    iconBox: {
        width: scale(36),
        height: scale(36),
        borderRadius: radius._10,

        justifyContent: "center",
        alignItems: "center",
    },
    textBox: {
        flex: 1,
        gap: 2,
    },
});