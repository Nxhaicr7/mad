import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { spacingX, spacingY, colors } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import { scale, verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

const SettingsModal = () => {
    const { isDarkMode, toggleTheme, colors } = useTheme();
    const { t, i18n } = useTranslation();
    const router = useRouter();

    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);


    const toggleLanguage = () => {
        const currentLng = i18n.language;
        i18n.changeLanguage(currentLng === "vi" ? "en" : "vi");
    };

    return (
        <ModalWrapper>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header
                    title={t("Settings")}
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._20 }}
                />

                <View style={styles.section}>


                    <View style={[styles.row, { borderBottomColor: colors.border }]}>
                        <View style={styles.rowLeft}>
                            <Icons.Moon size={verticalScale(24)} color={colors.text} />
                            <Typo color={colors.text} style={{ marginLeft: scale(10) }}>
                                {t("Dark Mode")}
                            </Typo>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.neutral400, true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    </View>


                    <TouchableOpacity onPress={toggleLanguage} style={[styles.row, { borderBottomColor: colors.border }]}>
                        <View style={styles.rowLeft}>
                            <Icons.Globe size={verticalScale(24)} color={colors.text} />
                            <Typo color={colors.text} style={{ marginLeft: scale(10) }}>
                                {t("Language")}
                            </Typo>
                        </View>
                        <View style={styles.rowRight}>
                            <Typo color={colors.textLight} style={{ marginRight: scale(5) }}>
                                {i18n.language === "vi" ? "Tiếng Việt" : "English"}
                            </Typo>
                            <Icons.ArrowsLeftRight size={verticalScale(20)} color={colors.textLight} />
                        </View>
                    </TouchableOpacity>


                    <View style={[styles.row, { borderBottomColor: colors.border }]}>
                        <View style={styles.rowLeft}>
                            <Icons.Bell size={verticalScale(24)} color={colors.text} />
                            <Typo color={colors.text} style={{ marginLeft: scale(10) }}>
                                {t("Notifications")}
                            </Typo>
                        </View>
                        <Switch
                            value={isNotificationsEnabled}
                            onValueChange={setIsNotificationsEnabled}
                            trackColor={{ false: colors.neutral400, true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    </View>

                    {/* 4. Đổi mật khẩu */}
                    <TouchableOpacity
                        style={[styles.row, { borderBottomColor: colors.border }]}

                        onPress={() => router.push("/(auth)/changePasswordModal")}
                    >
                        <View style={styles.rowLeft}>
                            <Icons.LockKey size={verticalScale(24)} color={colors.text} />
                            <Typo color={colors.text} style={{ marginLeft: scale(10) }}>
                                {t("Change Password")}
                            </Typo>
                        </View>
                        <View style={styles.rowRight}>
                            <Typo color={colors.primary} fontWeight={"600"} style={{ marginRight: scale(5) }}>
                                {t("Update")}
                            </Typo>
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