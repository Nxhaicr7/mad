import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { createNotification } from "@/services/notificationService";
import {
  createOrUpdateTransaction,
  deleteTransaction,
  ExpenseLimitExceededItem,
  getExceededExpenseLimits,
} from "@/services/transactionService";
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

const TransactionModal = () => {
  const { user } = useAuth();

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
      Khác: "others",
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

    setTransaction({
      ...transaction,
      date: currentDate,
    });

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
      Alert.alert("Giao dịch", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    const notifyBudgetStatus = async (
      items: ExpenseLimitExceededItem[],
      statusType: "near-limit" | "exceeded-limit",
    ) => {
      if (!user?.uid || !items.length) return;

      const periodLabel: Record<string, string> = {
        day: "ngày",
        week: "tuần",
        month: "tháng",
      };

      await Promise.all(
        items.map((item) =>
          createNotification({
            uid: user.uid as string,
            type: statusType,
            title: "Cảnh báo giới hạn chi tiêu",
            description:
              statusType === "near-limit"
                ? `Ví của bạn sắp vượt giới hạn ${periodLabel[item.type]} (${item.nextSpent.toLocaleString("vi-VN")}đ/${item.limitAmount.toLocaleString("vi-VN")}đ).`
                : `Ví của bạn đã vượt giới hạn ${periodLabel[item.type]} (${item.nextSpent.toLocaleString("vi-VN")}đ/${item.limitAmount.toLocaleString("vi-VN")}đ).`,
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
        Alert.alert("Giao dịch", res.msg);
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
        Alert.alert("Giao dịch", warningRes.msg);
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
              `${periodLabel[item.type]}: giới hạn ${item.limitAmount.toLocaleString("vi-VN")}đ, sau giao dịch là ${item.nextSpent.toLocaleString("vi-VN")}đ`,
          )
          .join("\n");

        Alert.alert(
          "Cảnh báo giới hạn chi tiêu",
          `Đã vượt giới hạn chi tiêu của ví.\n${warningText}\n\nBạn có đồng ý thêm giao dịch này không?`,
          [
            {
              text: "Hủy",
              style: "cancel",
            },
            {
              text: "Đồng ý",
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
      Alert.alert("Giao dịch", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa giao dịch này không?", [
      {
        text: "Hủy",
        onPress: () => console.log("cancel delete"),
        style: "cancel",
      },
      {
        text: "Xóa",
        onPress: () => onDelete(),
        style: "destructive",
      },
    ]);
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Cập nhật giao dịch" : "Giao dịch mới"}
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

        {/* form */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          {/* transaction types */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Loại
            </Typo>

            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              // placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              // placeholder={"Select item"}
              value={transaction.type}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
            />
          </View>

          {/* wallets */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Ví
            </Typo>

            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={wallets.map((wallet) => ({
                label: `${wallet?.name} (${Number(wallet.amount).toLocaleString("vi-VN")}đ)`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              placeholder="Chọn ví"
              value={transaction.walletId}
              onChange={(item) => {
                setTransaction({
                  ...transaction,
                  walletId: item.value || "",
                });
              }}
            />
          </View>

          {/* expense categories */}
          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200}>Danh mục chi tiêu</Typo>

              <Dropdown
                style={styles.dropdownContainer}
                activeColor={colors.neutral700}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdownIcon}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                placeholder="Chọn danh mục"
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Ngày
            </Typo>

            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString("vi-VN")}
                </Typo>
              </Pressable>
            )}

            {showDatePicker && (
              <View style={Platform.OS === "ios" && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                />

                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={"500"}>
                      Ok
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* amount */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Số tiền
            </Typo>

            <Input
              placeholder="Nhập số tiền..."
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

          {/* description */}
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>
                Mô tả
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                (tùy chọn)
              </Typo>
            </View>

            <Input
              placeholder="Nhập nội dung..."
              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: 15,
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>

          {/* receipt */}
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>
                Ảnh hóa đơn
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                (tùy chọn)
              </Typo>
            </View>
            <ImageUpload
              file={transaction.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              placeholder="Tải ảnh lên"
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
                QUÉT HÓA ĐƠN AI
              </Typo>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <View style={styles.footer}>
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
            {oldTransaction?.id ? "Cập nhật" : "Lưu"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },

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
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
    marginBottom: spacingY._5,
  },

  inputContainer: {
    gap: spacingY._10,
  },

  androidDropdown: {
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    // paddingHorizontal: spacingX._15,
  },

  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },

  iosDatePicker: {
    // backgroundColor: "red",
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownItemText: { color: colors.white },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
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