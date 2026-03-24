import Loading from '@/components/Loading';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import WalletListItem from '@/components/WalletListItem';
import { radius, spacingX, spacingY } from '@/constants/theme'; // Bỏ import colors tĩnh
import { useAuth } from '@/contexts/authContext';
import { useTheme } from '@/contexts/themeContext'; // Gọi hook theme
import useFetchData from '@/hooks/useFetchData';
import { WalletType } from '@/types';
import { verticalScale } from '@/utils/styling';
import { useRouter } from "expo-router";
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

const Wallet = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { colors } = useTheme(); // Lấy bảng màu động

    const { data: wallets, error, loading } = useFetchData<WalletType>("wallets", [
        where("uid", "==", user?.uid),
        orderBy("created", "desc"),
    ]);

    const getTotalBalance = () =>
        wallets.reduce((total, item) => {
            total = total + (item.amount || 0);
            return total;
        }, 0);

    return (
        // 1. Đổi nền ngoài cùng thành nền động
        <ScreenWrapper style={{ backgroundColor: colors.background }}>
            <View style={styles.container}>
                {/* 2. Đổi nền khu vực số dư */}
                <View style={[styles.balanceView, { backgroundColor: colors.background }]}>
                    <View style={{ alignItems: "center" }}>
                        {/* Thêm color động để chữ tự đổi màu đen/trắng */}
                        <Typo size={45} fontWeight={"500"} color={colors.text}>
                            ${getTotalBalance()?.toFixed(2)}
                        </Typo>
                        <Typo size={16} color={colors.textLight}>
                            Total Balance
                        </Typo>
                    </View>
                </View>

                {/* 3. Đổi nền khu vực danh sách ví */}
                <View style={[styles.wallets, { backgroundColor: colors.surface || colors.neutral100 }]}>
                    <View style={styles.flexRow}>
                        {/* Đổi màu chữ */}
                        <Typo size={20} fontWeight={"500"} color={colors.text}>
                            My Wallets
                        </Typo>
                        <TouchableOpacity onPress={() => router.push("/(modals)/walletModal")}>
                            <Icons.PlusCircle
                                weight="fill"
                                color={colors.primary}
                                size={verticalScale(33)}
                            />
                        </TouchableOpacity>
                    </View>
                    {loading && <Loading />}
                    <FlatList
                        data={wallets}
                        renderItem={({ item, index }) => {
                            return <WalletListItem item={item} index={index} router={router} />
                        }}
                        contentContainerStyle={styles.listStyle}
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default Wallet;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    balanceView: {
        height: verticalScale(160),
        // Đã xoá backgroundColor tĩnh ở đây, thay bằng màu động bên trên
        justifyContent: "center",
        alignItems: "center",
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacingY?._10 || 10,
    },
    wallets: {
        flex: 1,
        // Đã xoá backgroundColor tĩnh ở đây, thay bằng màu động bên trên
        borderTopRightRadius: radius?._30 || 30,
        borderTopLeftRadius: radius?._30 || 30,
        padding: spacingX?._20 || 20,
        paddingTop: spacingX?._25 || 25,
    },
    listStyle: {
        paddingVertical: spacingY?._25 || 25,
        paddingTop: spacingY?._15 || 15,
    },
});