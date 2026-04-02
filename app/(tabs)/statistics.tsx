import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View, Text } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { BarChart } from "react-native-gifted-charts";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import { radius, spacingX, spacingY } from "@/constants/theme"; // 👈 Bỏ import colors tĩnh
import { useAuth } from "@/contexts/authContext";
import { useTheme } from "@/contexts/themeContext"; // 👈 Gọi máy dò theme
import {
  fetchMonthlyStats,
  fetchWeeklyStats,
  fetchYearlyStats,
} from "@/services/transactionService";
import { scale, verticalScale } from "@/utils/styling";

const Statistics = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme(); // 👈 Lấy bảng màu sống

  const getWeeklyStats = async () => {
    setChartLoading(true);
    let res = await fetchWeeklyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Lỗi", res.msg);
    }
  };

  const getMonthlyStats = async () => {
    setChartLoading(true);
    let res = await fetchMonthlyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Lỗi", res.msg);
    }
  };

  const getYearlyStats = async () => {
    setChartLoading(true);
    let res = await fetchYearlyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Lỗi", res.msg);
    }
  };

  useEffect(() => {
    if (activeIndex === 0) getWeeklyStats();
    if (activeIndex === 1) getMonthlyStats();
    if (activeIndex === 2) getYearlyStats();
  }, [activeIndex]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Thống kê" showNotification />
        </View>

        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Thanh tuần/tháng/năm - Đã fix Sáng/Tối */}
          <SegmentedControl
            values={["Tuần", "Tháng", "Năm"]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor={isDarkMode ? colors.neutral200 : colors.white}
            backgroundColor={isDarkMode ? colors.neutral800 : colors.neutral200}
            appearance={isDarkMode ? "dark" : "light"}
            activeFontStyle={{ ...styles.segmentFontStyle, color: colors.text }}
            style={styles.segmentStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.textLight }}
          />

          <View style={styles.chartContainer}>
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                barWidth={scale(12)}
                spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                roundedBottom
                roundedTop
                hideRules
                yAxisLabelSuffix="đ"
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={scale(45)}
                // 🛠️ FIX Ở ĐÂY: Dùng textLight để nổi bật ở cả 2 mode 🛠️
                yAxisTextStyle={{ color: colors.textLight }}
                xAxisLabelTextStyle={{
                  color: colors.textLight,
                  fontSize: verticalScale(12),
                }}
                noOfSections={3}
                minHeight={5}
              />
            ) : (
              <View style={[styles.noChart, { backgroundColor: colors.neutral100 }]} />
            )}

            {chartLoading && (
              <View style={[styles.chartLoadingContainer, { backgroundColor: isDarkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)" }]}>
                <Loading color={colors.primary} />
              </View>
            )}
          </View>

          <View>
            <TransactionList
              title="Giao dịch"
              emptyListMessage="Không tìm thấy giao dịch nào"
              data={transactions}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {},
  noChart: {
    height: verticalScale(210),
    width: "100%",
    borderRadius: radius._12,
  },
  segmentStyle: {
    height: scale(37),
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
});