import { expenseCategories, incomeCategory } from "@/constants/data";
import { radius, spacingX, spacingY } from "@/constants/theme";
import {
  TransactionItemProps,
  TransactionListType,
  TransactionType,
} from "@/types";
import { verticalScale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Loading from "./Loading";
import Typo from "./Typo";
import { useTheme } from "@/contexts/themeContext";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const router = useRouter();


  const { colors, isDarkMode } = useTheme();

  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount?.toString(),
        category: item?.category,
        date: (item.date as Timestamp)?.toDate()?.toISOString(),
        description: item?.description,
        image: item?.image,
        uid: item?.uid,
        walletId: item?.walletId,
      },
    });
  };

  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight="500" style={{ marginBottom: spacingY._10 }}>
          {title}
        </Typo>
      )}

      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          keyExtractor={(item, index) => String(item?.id || index)}
        />

        {!loading && data?.length === 0 && (
          <Typo
            size={15}

            color={isDarkMode ? colors.neutral400 : '#666666'}
            style={{ textAlign: "center", marginTop: spacingY._15 }}
          >
            {emptyListMessage}
          </Typo>
        )}

        {loading && (
          <View style={{ top: verticalScale(100) }}>
            <Loading color={colors.primary} />
          </View>
        )}
      </View>
    </View>
  );
};

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {


  const { colors, isDarkMode } = useTheme();

  let category =
    item?.type == "income" ? incomeCategory : expenseCategories[item.category!];
  const IconComponent = category.icon;

  const date = (item?.date as Timestamp)
    ?.toDate()
    ?.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
    });

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity
        style={[
          styles.row,

          { backgroundColor: colors.surface }
        ]}
        onPress={() => handleClick(item)}
      >
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          {IconComponent && (
            <IconComponent
              size={verticalScale(25)}
              weight="fill"
              color={"#ffffff"}
            />
          )}
        </View>

        <View style={styles.categoryDes}>
          <Typo size={17}>{category.label}</Typo>
          <Typo
            size={12}

            color={isDarkMode ? colors.neutral400 : '#666666'}
            textProps={{ numberOfLines: 1 }}
          >
            {item?.description}
          </Typo>
        </View>

        <View style={styles.amountDate}>
          <Typo
            fontWeight={"500"}
            color={item?.type === "income" ? colors.green : colors.rose}
          >
            {`${item?.type === "income" ? "+ " : "- "}${item?.amount.toLocaleString("vi-VN")}đ`}
          </Typo>

          <Typo size={13} color={isDarkMode ? colors.neutral400 : '#666666'}>
            {date}
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._17,
  },
  list: {
    minHeight: 3,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDes: {
    flex: 1,
    gap: 2.5,
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
    padding: spacingY._10,
    borderRadius: radius._17,
    paddingHorizontal: spacingX._10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});