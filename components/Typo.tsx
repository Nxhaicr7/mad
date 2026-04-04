import { TypoProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { Text, TextStyle } from "react-native";
import { useTheme } from "@/contexts/themeContext";

const Typo = ({
  size,
  color,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const { colors } = useTheme();

  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color: color ? color : colors.text,
    fontWeight,
  };
  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;