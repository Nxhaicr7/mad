import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import TransactionList from "@/components/TransactionList";
import { spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useTheme } from "@/contexts/themeContext";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const SearchModal = () => {
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();
  const [search, setSearch] = useState("");

  const router = useRouter();

  const constraints = [where("uid", "==", user?.uid), orderBy("date", "desc")];

  const {
    data: allTransactions,
    loading: transactionsLoading,
  } = useFetchData<TransactionType>("transactions", constraints);

  const filteredTransactions = allTransactions.filter((item) => {
    if (search.length > 1) {
      const searchLower = search.toLowerCase();
      return (
        item.category?.toLowerCase()?.includes(searchLower) ||
        item.type?.toLowerCase()?.includes(searchLower) ||
        item.description?.toLowerCase()?.includes(searchLower)
      );
    }
    return true;
  });

  return (

    <ModalWrapper style={{ backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Header
          title={"Tìm kiếm"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            {/* 🛠️ FIX 2: Ô Input tự đổi màu nền và màu chữ */}
            <Input
              placeholder="Nhập từ khóa (tên, danh mục...)"
              value={search}
              placeholderTextColor={colors.textLighter}
              containerStyle={{
                backgroundColor: isDarkMode ? colors.neutral800 : colors.neutral200,
                borderColor: colors.border
              }}
              onChangeText={(value) => setSearch(value)}
            />
          </View>

          <View>
            {/* TransactionList bên trong đã được anh em mình fix theme rồi nên cứ thế dùng thôi */}
            <TransactionList
              loading={transactionsLoading}
              data={filteredTransactions}
              emptyListMessage="Không tìm thấy giao dịch nào phù hợp"
            />
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});