import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
    icon: React.ReactNode;
    label: string;
    value: string;
};

const ScanResultItem = ({ icon, label, value }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconBox}>{icon}</View>
            <View style={styles.textBox}>
                <Typo size={12} color={colors.neutral400}>
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
        backgroundColor: colors.neutral800,
        borderRadius: radius._12,
        padding: spacingY._12,
    },
    iconBox: {
        width: scale(36),
        height: scale(36),
        borderRadius: radius._10,
        backgroundColor: colors.neutral700,
        justifyContent: "center",
        alignItems: "center",
    },
    textBox: {
        flex: 1,
        gap: 2,
    },
});
