import BackButton from "@/components/BackButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { spacingX, spacingY } from "@/constants/theme";
import { useTheme } from "@/contexts/themeContext";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

const PrivacyModal = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton iconSize={28} />
                    <Typo size={20} fontWeight={"700"}>
                        {t("Chính sách bảo mật")}
                    </Typo>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                >
                    <View style={[styles.card, { backgroundColor: colors.neutral200 }]}>
                        <Icons.ShieldCheck
                            size={verticalScale(45)}
                            color={colors.primary}
                            weight="duotone"
                        />
                        <Typo size={18} fontWeight={"700"} style={{ marginTop: 10, textAlign: 'center' }}>
                            {t("Cam kết bảo mật tuyệt đối")}
                        </Typo>
                        <Typo size={14} color={colors.textLight} style={{ marginTop: 5, textAlign: 'center' }}>
                            {t("Dữ liệu chi tiêu là tài sản cá nhân của bạn. Chúng tôi bảo vệ nó bằng công nghệ an toàn nhất.")}
                        </Typo>
                    </View>

                    <View style={styles.section}>
                        <Typo size={16} fontWeight={"700"} color={colors.primary}>
                            {`1. ${t("Thu thập dữ liệu")}`}
                        </Typo>
                        <Typo size={14} color={colors.textLight} style={styles.paragraph}>
                            {t("Ứng dụng chỉ lưu trữ thông tin cơ bản gồm Email, Tên hiển thị và Ảnh đại diện để cá nhân hóa trải nghiệm của bạn.")}
                        </Typo>
                    </View>

                    <View style={styles.section}>
                        <Typo size={16} fontWeight={"700"} color={colors.primary}>
                            {`2. ${t("Mã hóa dữ liệu")}`}
                        </Typo>
                        <Typo size={14} color={colors.textLight} style={styles.paragraph}>
                            {t("Toàn bộ lịch sử giao dịch và ví tiền được mã hóa trên máy chủ của Google Firebase. Ngay cả đội ngũ phát triển cũng không thể đọc được dữ liệu này.")}
                        </Typo>
                    </View>

                    <View style={styles.section}>
                        <Typo size={16} fontWeight={"700"} color={colors.primary}>
                            {`3. ${t("Không chia sẻ cho bên thứ 3")}`}
                        </Typo>
                        <Typo size={14} color={colors.textLight} style={styles.paragraph}>
                            {t("Chúng tôi cam kết 100% không bán, chia sẻ hoặc sử dụng dữ liệu tài chính của bạn cho mục đích quảng cáo hay bất kỳ bên thứ ba nào khác.")}
                        </Typo>
                    </View>

                    <View style={styles.section}>
                        <Typo size={16} fontWeight={"700"} color={colors.primary}>
                            {`4. ${t("Quyền xóa tài khoản")}`}
                        </Typo>
                        <Typo size={14} color={colors.textLight} style={styles.paragraph}>
                            {t("Bạn có toàn quyền yêu cầu xóa vĩnh viễn tài khoản và toàn bộ lịch sử giao dịch khỏi hệ thống bất cứ lúc nào.")}
                        </Typo>
                    </View>

                    <Typo size={12} color={colors.textLighter} style={{ textAlign: "center", marginTop: 20 }}>
                        {t("Cập nhật lần cuối: Tháng 3, 2026")}
                    </Typo>
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

export default PrivacyModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: spacingY._10,
        marginBottom: spacingY._20,
    },
    contentContainer: {
        paddingBottom: verticalScale(50),
    },
    card: {
        padding: verticalScale(20),
        borderRadius: 16,
        alignItems: "center",
        marginBottom: spacingY._25,
    },
    section: {
        marginBottom: spacingY._20,
    },
    paragraph: {
        marginTop: verticalScale(5),
        lineHeight: 22,
    }
});