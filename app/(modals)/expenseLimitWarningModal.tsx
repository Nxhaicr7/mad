import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import {
  createOrUpdateBudget,
  deleteBudget,
  getBudgetByWalletId,
} from "@/services/budgetService";
import { BudgetType, ExpenseLimitPeriod, WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const periodOptions: { label: string; value: ExpenseLimitPeriod }[] = [
  { label: "Ngày", value: "day" },
  { label: "Tuần", value: "week" },
  { label: "Tháng", value: "month" },
];

const periodLabel: Record<ExpenseLimitPeriod, string> = {
  day: "Ngày",
  week: "Tuần",
  month: "Tháng",
};

const periodOrder: Record<ExpenseLimitPeriod, number> = {
  day: 1,
  week: 2,
  month: 3,
};

const ExpenseLimitWarningModal = () => {
  const { user } = useAuth();

  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [budgetType, setBudgetType] = useState<ExpenseLimitPeriod>("day");
  const [budgetAmount, setBudgetAmount] = useState("");

  const { data: wallets } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  useEffect(() => {
    if (wallets.length && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id || "");
    }
  }, [wallets, selectedWalletId]);

  const fetchWalletBudgets = async (walletId: string) => {
    if (!walletId) {
      setBudgets([]);
      return;
    }

    const res = await getBudgetByWalletId(walletId);
    if (!res.success) {
      Alert.alert("Giới hạn chi tiêu", res.msg);
      return;
    }

    const sortedBudgets = (res.data || []).sort(
      (a: BudgetType, b: BudgetType) =>
        periodOrder[a.type] - periodOrder[b.type],
    );
    setBudgets(sortedBudgets);
  };

  useEffect(() => {
    fetchWalletBudgets(selectedWalletId);
  }, [selectedWalletId]);

  const onAddBudget = async () => {
    if (!selectedWalletId) {
      Alert.alert("Giới hạn chi tiêu", "Vui lòng chọn ví");
      return;
    }

    const amount = Number(budgetAmount.replace(/[^0-9]/g, ""));
    if (!amount || amount <= 0) {
      Alert.alert("Giới hạn chi tiêu", "Vui lòng nhập số tiền hợp lệ");
      return;
    }

    setLoading(true);
    const res = await createOrUpdateBudget({
      walletId: selectedWalletId,
      type: budgetType,
      amount,
    });
    setLoading(false);

    if (!res.success) {
      Alert.alert("Giới hạn chi tiêu", res.msg);
      return;
    }

    setShowAddModal(false);
    setBudgetAmount("");
    setBudgetType("day");
    fetchWalletBudgets(selectedWalletId);
  };

  const onDeleteBudget = async (id?: string) => {
    if (!id) return;

    setLoading(true);
    const res = await deleteBudget(id);
    setLoading(false);

    if (!res.success) {
      Alert.alert("Giới hạn chi tiêu", res.msg);
      return;
    }

    fetchWalletBudgets(selectedWalletId);
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Cảnh báo giới hạn chi tiêu"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Chọn ví
            </Typo>

            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={wallets.map((wallet) => ({
                label: wallet.name,
                value: wallet.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              placeholder="Chọn ví"
              value={selectedWalletId}
              onChange={(item) => {
                setSelectedWalletId(item.value || "");
              }}
            />
          </View>

          <View style={styles.flexRow}>
            <Typo color={colors.neutral200} size={16}>
              Danh sách cảnh báo
            </Typo>
          </View>

          <View style={styles.warningList}>
            {budgets.map((item) => (
              <View style={styles.warningItem} key={item.id || item.type}>
                <Typo size={14} color={colors.neutral100}>
                  {item.amount.toLocaleString("vi-VN")}đ - Loại:{" "}
                  {periodLabel[item.type]}
                </Typo>

                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => onDeleteBudget(item.id)}
                  activeOpacity={0.85}
                >
                  <Icons.Trash
                    size={verticalScale(14)}
                    color={colors.white}
                    weight="bold"
                  />
                </TouchableOpacity>
              </View>
            ))}

            {!budgets.length && (
              <View style={styles.emptyBox}>
                <Typo color={colors.neutral400} size={14}>
                  Chưa có cảnh báo nào
                </Typo>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button
          onPress={() => setShowAddModal(true)}
          loading={loading}
          style={{ flex: 1 }}
        >
          <Typo color={colors.white} fontWeight={"700"} size={24}>
            Thêm cảnh báo mới
          </Typo>
        </Button>
      </View>

      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.addModalCard}>
            <Typo size={16} fontWeight={"700"}>
              Thêm giới hạn chi tiêu
            </Typo>

            <View style={styles.inputContainer}>
              <Typo color={colors.neutral300} size={14}>
                Loại
              </Typo>
              <Dropdown
                style={styles.dropdownContainer}
                activeColor={colors.neutral700}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdownIcon}
                data={periodOptions}
                maxHeight={260}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                value={budgetType}
                onChange={(item) =>
                  setBudgetType(item.value as ExpenseLimitPeriod)
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Typo color={colors.neutral300} size={14}>
                Số tiền
              </Typo>
              <Input
                keyboardType="numeric"
                placeholder="Nhập số tiền..."
                value={budgetAmount}
                onChangeText={(value) =>
                  setBudgetAmount(value.replace(/[^0-9]/g, ""))
                }
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
                activeOpacity={0.85}
              >
                <Typo size={14} color={colors.white}>
                  Hủy
                </Typo>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={onAddBudget}
                activeOpacity={0.85}
              >
                <Typo size={14} color={colors.black} fontWeight={"700"}>
                  Lưu
                </Typo>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ModalWrapper>
  );
};

export default ExpenseLimitWarningModal;

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
  inputContainer: {
    gap: spacingY._10,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  warningList: {
    gap: spacingY._12,
  },
  warningItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.neutral800,
    borderRadius: radius._12,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._10,
    borderColor: colors.neutral700,
    borderWidth: 1,
  },
  deleteIcon: {
    height: verticalScale(30),
    width: verticalScale(30),
    borderRadius: radius._10,
    backgroundColor: colors.rose,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBox: {
    borderColor: colors.neutral700,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: radius._12,
    paddingVertical: spacingY._15,
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
    marginBottom: spacingY._5,
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
  },
  addModalCard: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    padding: spacingX._15,
    gap: spacingY._15,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },
  modalActions: {
    flexDirection: "row",
    gap: spacingX._10,
    justifyContent: "flex-end",
  },
  modalButton: {
    minWidth: verticalScale(90),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacingY._10,
    borderRadius: radius._10,
  },
  cancelButton: {
    backgroundColor: colors.neutral700,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
});
