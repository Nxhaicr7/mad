import React from "react";
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    StyleSheet,
    View
} from "react-native";
import { useTheme } from "@/contexts/themeContext";
const Loading = ({
    size = "large",
    color,
}: ActivityIndicatorProps) => {
    const { colors } = useTheme();


    const spinnerColor = color || colors.primary;

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size={size} color={spinnerColor} />
        </View>
    );
};

export default Loading;

const styles = StyleSheet.create({});