import { TypoProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { Text, TextStyle } from "react-native";
import { useTheme } from "@/contexts/themeContext"; // 1. Gọi hook theme

const Typo = ({
  size,
  color, // 2. Bỏ giá trị mặc định tĩnh ở đây
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const { colors } = useTheme(); // 3. Lấy bảng màu động

  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color: color ? color : colors.text, // 4. Tự động lấy màu chữ chuẩn theo theme nếu không có prop truyền vào
    fontWeight,
  };
  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;