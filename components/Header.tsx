import { HeaderProps } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import NotificationBell from "./NotificationBell";
import Typo from "./Typo";

const Header = ({
  title = "",
  leftIcon,
  rightIcon,
  showNotification = false,
  style,
}: HeaderProps) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.side}>{leftIcon || <View style={styles.placeholder} />}</View>

            <View style={styles.titleWrap}>
                {title && (
                    <Typo
                        size={22}
                        fontWeight={"600"}
                        style={{ textAlign: "center" }}
                    >
                        {title}
                    </Typo>
                )}
            </View>

            <View style={[styles.side, styles.rightSide]}>
                {rightIcon}
                {showNotification && <NotificationBell />}
                {!rightIcon && !showNotification && <View style={styles.placeholder} />}
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    side: {
        minWidth: 44,
        minHeight: 44,
        justifyContent: "center",
    },
    rightSide: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 8,
    },
    titleWrap: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    placeholder: {
        width: 38,
        height: 38,
    },
});