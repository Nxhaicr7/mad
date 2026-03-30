import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { radius, spacingX, spacingY } from "@/constants/theme"; // Bỏ import colors tĩnh
import { useAuth } from "@/contexts/authContext";
import { useTheme } from "@/contexts/themeContext"; // 1. Import hook theme
import useFetchData from "@/hooks/useFetchData";
import {
  createOrUpdateTransaction,
  deleteTransaction,
<<<<<<< HEAD
} from "@/services/transactionService";
=======
  getExceededExpenseLimits,
  ExpenseLimitExceededItem,
} from "@/services/transactionService";
import { createNotification } from "@/services/notificationService";
>>>>>>> origin/main
import { TransactionType, WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTranslation } from "react-i18next"; // <-- Thêm dòng này

const TransactionModal = () => {
  const { t } = useTranslation(); // <-- Khai báo t
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme(); // 2. Lấy màu động

  const [transaction, setTransaction] = useState({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  type paramType = {
    id: string;
    type: string;
    amount: string;
    category?: string;
    date: string;
    description?: string;
    image?: any;
    uid?: string;
    walletId: string;
    // params từ AI scan
    scanned?: string;
  };

  const oldTransaction: paramType = useLocalSearchParams();

  // Map category tiếng Việt từ AI → value của app
  const mapAICategory = (aiCategory: string): string => {
    const map: Record<string, string> = {
      "Ăn uống": "dining",
      "Di chuyển": "transportation",
      "Mua sắm": "groceries",
      "Y tế": "health",
      "Giải trí": "entertainment",
      "Giáo dục": "personal",
      "Hóa đơn": "utilities",
      "Khác": "others",
    };
    return map[aiCategory] || "others";
  };

  // Parse date từ "DD/MM/YYYY HH:mm" hoặc "DD/MM/YYYY"
  const parseScannedDate = (dateStr: string): Date => {
    try {
      const [datePart] = dateStr.split(" ");
      const [day, month, year] = datePart.split("/");
      return new Date(Number(year), Number(month) - 1, Number(day));
    } catch {
      return new Date();
    }
  };

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS === "ios" ? true : false);
  };

  useEffect(() => {
    if (oldTransaction?.id) {
      // Chỉnh sửa giao dịch cũ
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction.amount),
        description: oldTransaction.description || "",
        category: oldTransaction.category || "",
        date: new Date(oldTransaction.date),
        walletId: oldTransaction.walletId,
        image: oldTransaction?.image ?? null,
      });
    } else if (oldTransaction?.scanned === "true") {
      // Điền từ kết quả AI scan
      setTransaction((prev) => ({
        ...prev,
        amount: Number(oldTransaction.amount) || 0,
        description: oldTransaction.description || "",
        category: mapAICategory(oldTransaction.category || ""),
        date: parseScannedDate(oldTransaction.date || ""),
      }));
    }
  }, []);

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;
    if (!walletId || !date || !amount || (type == "expense" && !category)) {
      Alert.alert(t("Transaction"), t("Please fill all the fields"));
      return;
    }
<<<<<<< HEAD
    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image: image ? image : null,
      uid: user?.uid,
    };
    if (oldTransaction?.id) transactionData.id = oldTransaction.id;
    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert(t("Transaction"), res.msg);
=======

    const notifyBudgetStatus = async (
      items: ExpenseLimitExceededItem[],
      statusType: "near-limit" | "exceeded-limit",
    ) => {
      if (!user?.uid || !items.length) return;

      const periodLabel: Record<string, string> = {
        day: "day",
        week: "week",
        month: "month",
      };

      await Promise.all(
        items.map((item) =>
          createNotification({
            uid: user.uid as string,
            type: statusType,
            title: "Expense limit warning",
            description:
              statusType === "near-limit"
                ? `Your wallet is about to exceed ${periodLabel[item.type]} limit ($${item.nextSpent}/$${item.limitAmount}).`
                : `Your wallet has exceeded ${periodLabel[item.type]} limit ($${item.nextSpent}/$${item.limitAmount}).`,
          }),
        ),
      );
    };

    const submitTransaction = async () => {
      let transactionData: TransactionType = {
        type,
        amount,
        description,
        category,
        date,
        walletId,
        image: image ? image : null,
        uid: user?.uid,
      };

      if (oldTransaction?.id) transactionData.id = oldTransaction.id;
      setLoading(true);
      const res = await createOrUpdateTransaction(transactionData);
      setLoading(false);

      if (!res.success) {
        Alert.alert("Transaction", res.msg);
      }

      return res;
    };

    if (type === "expense") {
      const warningRes = await getExceededExpenseLimits(
        walletId,
        amount,
        date as Date,
        oldTransaction?.id,
      );

      if (!warningRes.success) {
        Alert.alert("Transaction", warningRes.msg);
        return;
      }

      const periodLabel: Record<string, string> = {
        day: "Ngày",
        week: "Tuần",
        month: "Tháng",
      };

      const exceededItems = warningRes.data?.exceededItems || [];
      const nearLimitItems = warningRes.data?.nearLimitItems || [];

      if (exceededItems.length) {
        const warningText = exceededItems
          .map(
            (item: any) =>
              `${periodLabel[item.type]}: giới hạn $${item.limitAmount}, sau giao dịch là $${item.nextSpent}`,
          )
          .join("\n");

        Alert.alert(
          "Expense Limit Warning",
          `Đã vượt giới hạn chi tiêu của ví.\n${warningText}\n\nBạn có đồng ý thêm giao dịch này không?`,
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                const submitRes = await submitTransaction();
                if (submitRes.success) {
                  await notifyBudgetStatus(exceededItems, "exceeded-limit");
                  router.back();
                }
              },
            },
          ],
        );
        return;
      }

      const submitRes = await submitTransaction();
      if (submitRes.success) {
        if (nearLimitItems.length) {
          await notifyBudgetStatus(nearLimitItems, "near-limit");
        }
        router.back();
      }
      return;
    }

    const submitRes = await submitTransaction();
    if (submitRes.success) {
      router.back();
>>>>>>> origin/main
    }
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteTransaction(
      oldTransaction?.id,
      oldTransaction?.walletId,
    );
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert(t("Transaction"), res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      t("Confirm"),
      t("Are you sure you want to delete this transaction?"),
      [
        { text: t("Cancel"), style: "cancel" },
        { text: t("Delete"), onPress: () => onDelete(), style: "destructive" },
      ],
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? t("Update Transaction") : t("New Transaction")}
          leftIcon={<BackButton />}
          rightIcon={
            !oldTransaction?.id ? (
              <TouchableOpacity
                onPress={() => router.push("/(modals)/scanInvoiceModal")}
                style={styles.scanIcon}
              >
                <Icons.Scan
                  size={verticalScale(22)}
                  color={colors.primary}
                  weight="bold"
                />
              </TouchableOpacity>
            ) : undefined
          }
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          {/* Type Dropdown */}
          <View style={styles.inputContainer}>
            <Typo color={colors.textLight} size={16}>
              {t("Type")}
            </Typo>
            <Dropdown
              style={[styles.dropdownContainer, { borderColor: colors.border }]}
              activeColor={isDarkMode ? colors.neutral700 : colors.neutral200}
              selectedTextStyle={[
                styles.dropdownSelectedText,
                { color: colors.text },
              ]}
              iconStyle={[styles.dropdownIcon, { tintColor: colors.textLight }]}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={{ color: colors.text }}
              itemContainerStyle={{ backgroundColor: colors.background }}
              containerStyle={[
                styles.dropdownListContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              value={transaction.type}
              onChange={(item) =>
                setTransaction({ ...transaction, type: item.value })
              }
            />
          </View>

          {/* Wallet Dropdown */}
          <View style={styles.inputContainer}>
            <Typo color={colors.textLight} size={16}>
              {t("Wallet")}
            </Typo>
            <Dropdown
              style={[styles.dropdownContainer, { borderColor: colors.border }]}
              activeColor={isDarkMode ? colors.neutral700 : colors.neutral200}
              placeholderStyle={{ color: colors.textLight }}
              selectedTextStyle={[
                styles.dropdownSelectedText,
                { color: colors.text },
              ]}
              iconStyle={[styles.dropdownIcon, { tintColor: colors.textLight }]}
              data={wallets.map((wallet) => ({
                label: `${wallet?.name} ($${wallet.amount})`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={{ color: colors.text }}
              containerStyle={[
                styles.dropdownListContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
              placeholder={t("Select wallet")}
              value={transaction.walletId}
              onChange={(item) =>
                setTransaction({ ...transaction, walletId: item.value || "" })
              }
            />
          </View>

          {/* Category Dropdown */}
          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.textLight}>{t("Expense Category")}</Typo>
              <Dropdown
                style={[
                  styles.dropdownContainer,
                  { borderColor: colors.border },
                ]}
                activeColor={isDarkMode ? colors.neutral700 : colors.neutral200}
                placeholderStyle={{ color: colors.textLight }}
                selectedTextStyle={[
                  styles.dropdownSelectedText,
                  { color: colors.text },
                ]}
                iconStyle={[
                  styles.dropdownIcon,
                  { tintColor: colors.textLight },
                ]}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={{ color: colors.text }}
                containerStyle={[
                  styles.dropdownListContainer,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
                placeholder={t("Select category")}
                value={transaction.category}
                onChange={(item) =>
                  setTransaction({ ...transaction, category: item.value || "" })
                }
              />
            </View>
          )}

          {/* Date Picker */}
          <View style={styles.inputContainer}>
            <Typo color={colors.textLight} size={16}>
              {t("Date")}
            </Typo>
            {!showDatePicker && (
              <Pressable
                style={[styles.dateInput, { borderColor: colors.border }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14} color={colors.text}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}
            {showDatePicker && (
              <View>
                <DateTimePicker
                  themeVariant={isDarkMode ? "dark" : "light"}
                  value={transaction.date as Date}
                  textColor={colors.text}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={[
                      styles.datePickerButton,
                      { backgroundColor: colors.neutral200 },
                    ]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={"500"} color={colors.text}>
                      {t("Ok")}
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Typo color={colors.textLight} size={16}>
              {t("Amount")}
            </Typo>
            <Input
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.textLight} size={16}>
                {t("Description")}
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                {t("(optional)")}
              </Typo>
            </View>
            <Input
              value={transaction.description}
              multiline
              containerStyle={{
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: 15,
              }}
              onChangeText={(value) =>
                setTransaction({ ...transaction, description: value })
              }
            />
          </View>

          {/* Receipt Upload */}
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.textLight} size={16}>
                {t("Receipt")}
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                {t("(optional)")}
              </Typo>
            </View>
            <ImageUpload
              file={transaction.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              placeholder={t("Upload Image")}
            />
          </View>

          {/* AI Scan button */}
          {!oldTransaction?.id && (
            <TouchableOpacity
              style={styles.aiScanButton}
              onPress={() => router.push("/(modals)/scanInvoiceModal")}
              activeOpacity={0.8}
            >
              <Icons.Robot
                size={verticalScale(20)}
                color={colors.primary}
                weight="fill"
              />
              <Typo size={15} fontWeight="700" color={colors.primary}>
                AI SCAN RECEIPT
              </Typo>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        {oldTransaction?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            {oldTransaction?.id ? t("Update") : t("Submit")}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopWidth: 1,
    marginBottom: spacingY._5,
  },
  inputContainer: { gap: spacingY._10 },
  flexRow: { flexDirection: "row", alignItems: "center", gap: spacingX._5 },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  datePickerButton: {
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownSelectedText: { fontSize: verticalScale(14) },
  dropdownListContainer: {
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
<<<<<<< HEAD
  dropdownIcon: { height: verticalScale(30) },
});
=======
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
  scanIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingY._7,
    borderRadius: radius._10,
  },
  aiScanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacingX._10,
    backgroundColor: colors.neutral800,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius._15,
    paddingVertical: spacingY._12,
    borderStyle: "dashed",
  },
});
>>>>>>> origin/main
