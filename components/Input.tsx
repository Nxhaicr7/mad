import { radius, spacingX } from "@/constants/theme"; // Bỏ import colors tĩnh
import { InputProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "@/contexts/themeContext"; // Thêm hook theme

const Input = (props: InputProps) => {
    const { colors } = useTheme(); // Lấy màu động

    return (
        <View
            style={[
                styles.container,
                { borderColor: colors.border }, // Viền đổi theo theme
                props.containerStyle && props.containerStyle
            ]}
        >
            {/* Nếu icon truyền vào chưa có màu, bạn có thể bọc logic màu ở đây nếu cần */}
            {props.icon && props.icon}

            <TextInput
                style={[
                    styles.input,
                    { color: colors.text }, // Chữ nhập vào đổi theo theme
                    props.inputStyle
                ]}
                placeholderTextColor={colors.textLight} // Màu gợi ý mờ đi
                ref={props.inputRef && props.inputRef}
                {...props}
            />
        </View>
    );
};

export default Input;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: verticalScale(54),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: radius._17,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._15,
        gap: spacingX._10,
    },

    input: {
        flex: 1,
        fontSize: verticalScale(14),
    },
});