import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { spacingX, spacingY } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import { scale, verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";

const SettingsModal = () => {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    // Tạm thời dùng state để hiển thị, sau này sẽ nối logic thật
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
    const [language, setLanguage] = useState("Tiếng Việt");

    // Hàm đổi ngôn ngữ (tạm thời)
    const toggleLanguage = () => {
        setLanguage(prev => prev === "Tiếng Việt" ? "Tiếng Anh" : "Tiếng Việt");
    };

    return (
        <ModalWrapper>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header
                    title="Settings"
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._20 }}
                />

                <View style={styles.section}>

                    {/* 1. Chế độ tối */}
                    <View style={[styles.row, { borderBottomColor: colors.border }]}>
                        <View style={styles.rowLeft}>
                            <Icons.Moon size={verticalScale(24)} color={colors.text} />
                            <Typo color={colors.text} style={{ marginLeft: scale(10) }}>Chế độ tối (Dark Mode)</Typo>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.neutral400, true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    </View>

                    {/* 2. Ngôn ngữ */}
                    <TouchableOpacity onPress={toggleLanguage} style={[styles.row, { borderBottomColor: colors.border }]}>
                        <View style={styles.rowLeft}>
                            <Icons.Globe size={verticalScale(24)} color={colors.text} />
                            <Typo color={colors.text} style={{ marginLeft: scale(10) }}>Ngôn ngữ</Typo>
                        </View>
                        <View style={styles.rowRight}>
                            <Typo color={colors.textLight} style={{ marginRight: scale(5) }}>{language}</Typo>
                            <Icons.ArrowsLeftRight size={verticalScale(20)} color={colors.textLight} />
                        </View>
                    </TouchableOpacity>

                    {/* 3. Thông báo */}
                    <View style={[styles.row, { borderBottomColor: colors.border }]}>
                        <View style={styles.rowLeft}>
                            <Icons.Bell size={verticalScale(24)} color={colors.text} />
                            <Typo color={colors.text} style={{ marginLeft: scale(10) }}>Thông báo</Typo>
                        </View>
                        <Switch
                            value={isNotificationsEnabled}
                            onValueChange={setIsNotificationsEnabled}
                            trackColor={{ false: colors.neutral400, true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    </View>

                    {/* 4. Đổi mật khẩu */}
                    <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]}>
                        <View style={styles.rowLeft}>
                            <Icons.LockKey size={verticalScale(24)} color={colors.text} />
                            <Typo color={colors.text} style={{ marginLeft: scale(10) }}>Đổi mật khẩu</Typo>
                        </View>
                        <View style={styles.rowRight}>
                            {/* Chữ "Đổi" được làm nổi bật */}
                            <Typo color={colors.primary} fontWeight={"600"} style={{ marginRight: scale(5) }}>Đổi</Typo>
                            <Icons.CaretRight size={verticalScale(20)} color={colors.textLight} />
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        </ModalWrapper>
    );
};

export default SettingsModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
    },
    section: {
        gap: spacingY._10,
        marginTop: spacingY._10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacingY._15,
        borderBottomWidth: 1,
    },
    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    rowRight: {
        flexDirection: "row",
        alignItems: "center",
    }
});