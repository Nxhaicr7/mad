import Button from "@/components/Button";
import HomeCard from "@/components/HomeCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import Typo from "@/components/Typo";
import { spacingX, spacingY } from "@/constants/theme"; // Đã bỏ import colors tĩnh
import { useAuth } from "@/contexts/authContext";
import { useTheme } from "@/contexts/themeContext"; // Thêm dòng này
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next"; // 1. Import hook dịch

const Home = () => {
  const { t } = useTranslation(); // 2. Khai báo hàm t
  const { user } = useAuth();
  const router = useRouter();
  const { colors } = useTheme(); // Lấy bảng màu động

  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30),
  ];

  const {
    data: recentTransactions,
    error,
    loading: transactionsLoading,
  } = useFetchData<TransactionType>("transactions", constraints);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            {/* Truyền màu chữ phụ (textLight) cho chữ Hello */}
            <Typo size={16} color={colors.textLight}>
              {t("Hello,")}
            </Typo>
            {/* Không truyền màu => Tự động lấy chữ chính (text) từ Typo.tsx */}
            <Typo size={20} fontWeight="500">
              {user?.name || t("Guest")}
            </Typo>
          </View>

          {/* Cập nhật màu động cho nút tìm kiếm */}
          <TouchableOpacity style={[styles.searchIcon, { backgroundColor: colors.neutral300 }]}>
            <Icons.MagnifyingGlass
              size={verticalScale(22)}
              color={colors.text}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* card */}
          <View>
            <HomeCard />
          </View>

          <TransactionList
            data={recentTransactions}
            loading={transactionsLoading}
            emptyListMessage={t("No Transactions added yet!")}
            title={t("Recent Transactions")}
          />

        </ScrollView>

        <Button
          style={styles.floatingButton}
          onPress={() => router.push("/(modals)/transactionModal")}
        >
          {/* Icon dấu + giữ màu đen vì nút thêm thường giữ nguyên một màu nền sáng */}
          <Icons.Plus
            color={"#000"}
            weight="bold"
            size={verticalScale(24)}
          />
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },

  searchIcon: {
    padding: spacingX._10,
    borderRadius: 50,
  },

  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },

  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});