import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { expenseCategories } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import {
  buildFallbackFinancialSummary,
  generateFinancialSummaryWithAI,
} from "@/services/aiService";
import { fetchMonthlyInsightStats } from "@/services/transactionService";
import {
  AISummaryResult,
  MonthlyCategoryBreakdownType,
  MonthlyInsightStatsType,
} from "@/types";
import { verticalScale } from "@/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const AISummary = () => {
  const [insightStats, setInsightStats] =
    useState<MonthlyInsightStatsType | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummaryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  const loadMonthlyInsight = useCallback(
    async (isRefresh = false) => {
      if (!user?.uid) return;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const statsRes = await fetchMonthlyInsightStats(user.uid as string);
        if (!statsRes.success || !statsRes.data) {
          Alert.alert(
            "AI Summary",
            statsRes.msg || "Không thể tải dữ liệu thống kê",
          );
          return;
        }

        const statsData = statsRes.data as MonthlyInsightStatsType;
        setInsightStats(statsData);

        const aiRes = await generateFinancialSummaryWithAI(statsData.aiPayload);
        if (aiRes.success && aiRes.data) {
          setAiSummary(aiRes.data as AISummaryResult);
        } else {
          setAiSummary(buildFallbackFinancialSummary(statsData.aiPayload));
        }

        setUpdatedAt(new Date());
      } catch {
        Alert.alert("AI Summary", "Đã có lỗi khi tải báo cáo tháng");
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [user?.uid],
  );

  const summary = useMemo(() => {
    if (!insightStats) return null;
    return aiSummary || buildFallbackFinancialSummary(insightStats.aiPayload);
  }, [aiSummary, insightStats]);

  useEffect(() => {
    loadMonthlyInsight();
  }, [loadMonthlyInsight]);

  const formatCurrency = (value: number) => {
    return `$${Math.abs(value).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}`;
  };

  const formatSignedPercent = (value: number) => {
    const rounded = Math.round(value);
    if (rounded > 0) return `+${rounded}%`;
    if (rounded < 0) return `${rounded}%`;
    return "0%";
  };

  const getToneStyles = (tone: "positive" | "warning" | "neutral") => {
    if (tone === "positive") {
      return {
        bg: "rgba(22,163,74,0.15)",
        text: "#4ade80",
      };
    }

    if (tone === "warning") {
      return {
        bg: "rgba(239,68,68,0.15)",
        text: "#f87171",
      };
    }

    return {
      bg: "rgba(250,204,21,0.15)",
      text: "#facc15",
    };
  };

  const renderCategoryIcon = (item: MonthlyCategoryBreakdownType) => {
    const IconComponent =
      expenseCategories[item.key]?.icon || expenseCategories.others.icon;

    return (
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <IconComponent
          size={verticalScale(18)}
          color={colors.white}
          weight="fill"
        />
      </View>
    );
  };

  if ((loading && !insightStats) || !summary || !insightStats) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Loading color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header
            title="AI Summary"
            rightIcon={
              <TouchableOpacity
                onPress={() => loadMonthlyInsight(true)}
                style={styles.refreshButton}
                disabled={refreshing}
              >
                {refreshing ? (
                  <Loading size="small" color={colors.white} />
                ) : (
                  <Icons.ArrowsClockwise
                    size={verticalScale(21)}
                    color={colors.white}
                    weight="bold"
                  />
                )}
              </TouchableOpacity>
            }
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.monthHeaderWrap}>
            <TouchableOpacity style={styles.monthNavButton}>
              <Icons.CaretLeft
                size={verticalScale(18)}
                color={colors.neutral300}
              />
            </TouchableOpacity>

            <View style={styles.monthTextWrap}>
              <Typo size={18} fontWeight="700">
                {insightStats.monthLabel}
              </Typo>
              <Typo size={15} color={colors.neutral500}>
                Báo cáo tháng
              </Typo>
            </View>

            <TouchableOpacity style={styles.monthNavButton}>
              <Icons.CaretRight
                size={verticalScale(18)}
                color={colors.neutral300}
              />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={["#0d611a", "#033b3d"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroHeaderRow}>
              <View style={styles.aiChip}>
                <Typo size={12} color={colors.primary} fontWeight="700">
                  AI Analysis
                </Typo>
              </View>

              <Typo size={12} color={colors.neutral300}>
                {updatedAt ? "Cập nhật vừa xong" : "Đang đồng bộ"}
              </Typo>
            </View>

            <Typo size={15} style={styles.summaryText}>
              {summary.summary}
            </Typo>

            <View style={styles.highlightRow}>
              {summary.highlights.map((item, index) => {
                const tone = getToneStyles(item.tone);
                return (
                  <View
                    key={`${item.text}-${index}`}
                    style={[styles.highlightChip, { backgroundColor: tone.bg }]}
                  >
                    <Typo size={13} fontWeight="600" color={tone.text}>
                      {item.text}
                    </Typo>
                  </View>
                );
              })}
            </View>
          </LinearGradient>

          <View style={styles.budgetCard}>
            {insightStats.hasMonthlyBudget ? (
              <>
                <View style={styles.budgetTopRow}>
                  <View style={styles.budgetCircleOuter}>
                    <View style={styles.budgetCircleInner}>
                      <Typo size={18} fontWeight="700">
                        {insightStats.budgetUsedPercent}%
                      </Typo>
                    </View>
                  </View>

                  <View style={styles.budgetContent}>
                    <Typo size={18} fontWeight="700" color={colors.rose}>
                      {formatCurrency(insightStats.totalExpense)}
                      <Typo size={16} color={colors.neutral500}>
                        {` /${formatCurrency(insightStats.budgetLimit)}`}
                      </Typo>
                    </Typo>
                    <Typo size={13} color={colors.neutral400}>
                      Budget tháng này
                    </Typo>
                    <Typo size={14} color={colors.neutral300}>
                      Còn lại
                      <Typo
                        size={14}
                        color={
                          insightStats.budgetRemaining >= 0
                            ? "#4ade80"
                            : colors.rose
                        }
                        fontWeight="700"
                      >
                        {` ${insightStats.budgetRemaining >= 0 ? "$" : "-$"}${Math.abs(
                          insightStats.budgetRemaining,
                        ).toFixed(2)}`}
                      </Typo>
                    </Typo>
                  </View>
                </View>

                <View style={styles.progressTrack}>
                  <LinearGradient
                    colors={["#a3e635", "#ef4444"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(100, Math.max(2, insightStats.budgetUsedPercent))}%`,
                      },
                    ]}
                  />
                </View>
              </>
            ) : (
              <View style={styles.noBudgetContainer}>
                <View style={styles.noBudgetIconWrap}>
                  <Icons.WarningCircle
                    size={verticalScale(22)}
                    color="#facc15"
                    weight="fill"
                  />
                </View>

                <View style={styles.noBudgetContent}>
                  <Typo size={18} fontWeight="700">
                    Chưa cấu hình budget theo tháng
                  </Typo>
                  <Typo
                    size={14}
                    color={colors.neutral400}
                    style={styles.noBudgetText}
                  >
                    Bạn cần thiết lập giới hạn tháng để theo dõi mức sử dụng
                    ngân sách chính xác hơn.
                  </Typo>

                  <TouchableOpacity
                    style={styles.setupBudgetButton}
                    onPress={() =>
                      router.push("/(modals)/expenseLimitWarningModal")
                    }
                    activeOpacity={0.85}
                  >
                    <Typo size={13} color={colors.black} fontWeight="700">
                      Thiết lập budget tháng
                    </Typo>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <Typo
            size={18}
            color={colors.neutral300}
            fontWeight="700"
            style={styles.sectionTitle}
          >
            Chỉ số tháng này
          </Typo>

          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <View
                style={[styles.kpiIconWrap, { backgroundColor: "#1d4ed8" }]}
              >
                <Icons.ArrowUp
                  size={verticalScale(16)}
                  color={colors.neutral200}
                  weight="bold"
                />
              </View>
              <View style={styles.kpiBadgeWarning}>
                <Typo size={11} color="#f87171" fontWeight="700">
                  {formatSignedPercent(insightStats.expenseChangePercent)}
                </Typo>
              </View>
              <Typo size={22} color={colors.rose} fontWeight="700">
                {formatCurrency(insightStats.totalExpense)}
              </Typo>
              <Typo size={12} color={colors.neutral400}>
                Tổng chi tiêu
              </Typo>
            </View>

            <View style={styles.kpiCard}>
              <View
                style={[styles.kpiIconWrap, { backgroundColor: "#065f46" }]}
              >
                <Icons.PiggyBank
                  size={verticalScale(16)}
                  color={colors.primary}
                  weight="fill"
                />
              </View>
              <View style={styles.kpiBadgePositive}>
                <Typo size={11} color="#4ade80" fontWeight="700">
                  {`${insightStats.savingsRate.toFixed(1)}%`}
                </Typo>
              </View>
              <Typo size={22} color="#4ade80" fontWeight="700">
                {`${insightStats.savings >= 0 ? "$" : "-$"}${Math.abs(insightStats.savings).toFixed(0)}`}
              </Typo>
              <Typo size={12} color={colors.neutral400}>
                Tiết kiệm
              </Typo>
            </View>

            <View style={styles.kpiCard}>
              <View
                style={[styles.kpiIconWrap, { backgroundColor: "#6d28d9" }]}
              >
                <Icons.Receipt
                  size={verticalScale(16)}
                  color={colors.neutral200}
                  weight="bold"
                />
              </View>
              <View style={styles.kpiBadgeNeutral}>
                <Typo size={11} color={colors.primary} fontWeight="700">
                  {formatSignedPercent(
                    insightStats.transactionCountChangePercent,
                  )}
                </Typo>
              </View>
              <Typo size={22} color={colors.white} fontWeight="700">
                {insightStats.transactionCount}
              </Typo>
              <Typo size={12} color={colors.neutral400}>
                Giao dịch
              </Typo>
            </View>

            <View style={styles.kpiCard}>
              <View
                style={[styles.kpiIconWrap, { backgroundColor: "#be185d" }]}
              >
                <Icons.ForkKnife
                  size={verticalScale(16)}
                  color={colors.neutral200}
                  weight="fill"
                />
              </View>
              <View style={styles.kpiBadgeWarning}>
                <Typo size={11} color="#f87171" fontWeight="700">
                  Top
                </Typo>
              </View>
              <Typo
                size={20}
                color={colors.white}
                fontWeight="700"
                textProps={{ numberOfLines: 1 }}
              >
                {insightStats.topCategoryLabel}
              </Typo>
              <Typo size={12} color={colors.neutral400}>
                Chi nhiều nhất
              </Typo>
            </View>
          </View>

          <Typo
            size={18}
            color={colors.neutral300}
            fontWeight="700"
            style={styles.sectionTitle}
          >
            Phân tích chi tiêu
          </Typo>

          <View style={styles.categoryList}>
            {insightStats.categories.map((item, index) => (
              <View key={`${item.key}-${index}`} style={styles.categoryCard}>
                <View style={styles.categoryTopRow}>
                  <View style={styles.categoryInfoWrap}>
                    {renderCategoryIcon(item)}
                    <View>
                      <Typo size={16} fontWeight="700">
                        {item.label}
                      </Typo>
                      <Typo size={12} color={colors.neutral500}>
                        {`${item.percent}% tổng chi tiêu`}
                      </Typo>
                    </View>
                  </View>

                  <Typo size={15} color={colors.rose} fontWeight="700">
                    {formatCurrency(item.amount)}
                  </Typo>
                </View>

                <View style={styles.categoryProgressTrack}>
                  <View
                    style={[
                      styles.categoryProgressFill,
                      {
                        width: `${Math.min(100, Math.max(0, item.percent))}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          <Typo
            size={18}
            color={colors.neutral300}
            fontWeight="700"
            style={styles.sectionTitle}
          >
            Gợi ý từ AI
          </Typo>

          <View style={styles.suggestionList}>
            {summary.suggestions.map((item, index) => {
              const tone = getToneStyles(item.tone);
              const IconComponent =
                item.tone === "positive"
                  ? Icons.PiggyBank
                  : item.tone === "warning"
                    ? Icons.Lightbulb
                    : Icons.ChartLineUp;

              return (
                <View
                  key={`${item.title}-${index}`}
                  style={styles.suggestionCard}
                >
                  <View
                    style={[
                      styles.suggestionIcon,
                      { backgroundColor: tone.bg },
                    ]}
                  >
                    <IconComponent
                      size={verticalScale(16)}
                      color={tone.text}
                      weight="fill"
                    />
                  </View>

                  <View style={styles.suggestionContent}>
                    <Typo size={16} fontWeight="700">
                      {item.title}
                    </Typo>
                    <Typo
                      size={14}
                      color={colors.neutral350}
                      style={styles.suggestionText}
                    >
                      {item.description}
                    </Typo>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default AISummary;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._5,
  },

  header: {
    marginBottom: spacingY._10,
  },

  content: {
    gap: spacingY._20,
    paddingBottom: verticalScale(120),
  },

  refreshButton: {
    width: verticalScale(42),
    height: verticalScale(42),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral800,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },

  monthHeaderWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacingY._5,
  },

  monthTextWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacingY._5,
  },

  monthNavButton: {
    width: verticalScale(42),
    height: verticalScale(42),
    borderRadius: 999,
    backgroundColor: colors.neutral800,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral700,
  },

  heroCard: {
    borderRadius: radius._30,
    padding: spacingY._15,
    gap: spacingY._15,
    borderWidth: 1,
    borderColor: "rgba(163,230,53,0.2)",
  },

  heroHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  aiChip: {
    backgroundColor: "rgba(163,230,53,0.13)",
    borderWidth: 1,
    borderColor: "rgba(163,230,53,0.35)",
    borderRadius: radius._20,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._7,
  },

  summaryText: {
    lineHeight: verticalScale(26),
  },

  highlightRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacingX._10,
  },

  highlightChip: {
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._7,
    borderRadius: radius._20,
  },

  budgetCard: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._30,
    padding: spacingY._15,
    gap: spacingY._15,
  },

  budgetTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
  },

  budgetCircleOuter: {
    width: verticalScale(85),
    height: verticalScale(85),
    borderRadius: 999,
    borderWidth: 7,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(163,230,53,0.08)",
  },

  budgetCircleInner: {
    width: "78%",
    height: "78%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral900,
  },

  budgetContent: {
    flex: 1,
    gap: spacingY._5,
  },

  noBudgetContainer: {
    flexDirection: "row",
    gap: spacingX._12,
    alignItems: "flex-start",
  },

  noBudgetIconWrap: {
    width: verticalScale(36),
    height: verticalScale(36),
    borderRadius: radius._12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(250, 204, 21, 0.15)",
  },

  noBudgetContent: {
    flex: 1,
    gap: spacingY._7,
  },

  noBudgetText: {
    lineHeight: verticalScale(20),
  },

  setupBudgetButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._7,
    borderRadius: radius._12,
  },

  progressTrack: {
    height: verticalScale(10),
    borderRadius: 999,
    backgroundColor: colors.neutral700,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  sectionTitle: {
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacingX._15,
  },

  kpiCard: {
    width: "47.5%",
    backgroundColor: colors.neutral800,
    borderRadius: radius._20,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._12,
    gap: spacingY._7,
  },

  kpiIconWrap: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: radius._12,
    alignItems: "center",
    justifyContent: "center",
  },

  kpiBadgeWarning: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(239,68,68,0.15)",
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._5,
    borderRadius: radius._20,
  },

  kpiBadgePositive: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(22,163,74,0.18)",
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._5,
    borderRadius: radius._20,
  },

  kpiBadgeNeutral: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(163,230,53,0.12)",
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._5,
    borderRadius: radius._20,
  },

  categoryList: {
    gap: spacingY._15,
  },

  categoryCard: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._20,
    padding: spacingY._12,
    gap: spacingY._10,
  },

  categoryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacingX._10,
  },

  categoryInfoWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    flex: 1,
  },

  categoryIcon: {
    width: verticalScale(42),
    height: verticalScale(42),
    borderRadius: radius._12,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryProgressTrack: {
    height: verticalScale(8),
    borderRadius: 999,
    backgroundColor: colors.neutral700,
    overflow: "hidden",
  },

  categoryProgressFill: {
    height: "100%",
    borderRadius: 999,
  },

  suggestionList: {
    gap: spacingY._15,
  },

  suggestionCard: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._20,
    padding: spacingY._12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX._12,
  },

  suggestionIcon: {
    width: verticalScale(38),
    height: verticalScale(38),
    borderRadius: radius._12,
    alignItems: "center",
    justifyContent: "center",
  },

  suggestionContent: {
    flex: 1,
    gap: spacingY._5,
  },

  suggestionText: {
    lineHeight: verticalScale(22),
  },
});
