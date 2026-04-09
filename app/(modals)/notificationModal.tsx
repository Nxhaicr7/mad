import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { firestore } from "@/config/firebase";
import { radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useTheme } from "@/contexts/themeContext";
import { NotificationType } from "@/types";
import { verticalScale } from "@/utils/styling";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const PAGE_SIZE = 10;

const getCreatedDate = (value: NotificationType["created"]): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === "object" && "toDate" in value) {
    try { return (value as any).toDate(); } catch { return null; }
  }
  return null;
};

const sortByCreatedDesc = (items: NotificationType[]) => {
  return [...items].sort((a, b) => {
    const first = getCreatedDate(a.created)?.getTime() || 0;
    const second = getCreatedDate(b.created)?.getTime() || 0;
    return second - first;
  });
};

const NotificationModal = () => {
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const fetchNotifications = async (isLoadMore = false) => {
    if (!user?.uid) return;

    if (isLoadMore) {
      if (loadingMore || !hasMore) return;
      setLoadingMore(true);
    } else {
      setLoading(true);
      setLastVisible(null);
      setHasMore(false);
    }

    try {
      const constraints: any[] = [where("uid", "==", user.uid)];
      if (isLoadMore && lastVisible) constraints.push(startAfter(lastVisible));
      constraints.push(limit(PAGE_SIZE));

      const notificationsQuery = query(collection(firestore, "notification"), ...constraints);
      const snapshot = await getDocs(notificationsQuery);

      const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as NotificationType));

      if (isLoadMore) {
        setNotifications((prev) => sortByCreatedDesc([...prev, ...items]));
      } else {
        setNotifications(sortByCreatedDesc(items));
      }

      const lastDoc = snapshot.docs.length ? snapshot.docs[snapshot.docs.length - 1] : null;
      setLastVisible(lastDoc);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      console.log("error fetching notifications: ", err);
    } finally {
      if (isLoadMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.uid]);

  return (
    <ModalWrapper>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title="Thông báo"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._15 }}
        />

        <Typo size={20} fontWeight={"700"} style={{ marginBottom: spacingY._10 }}>
          Thông báo gần đây
        </Typo>

        <FlatList
          data={notifications}
          keyExtractor={(item, index) => item.id || `${item.created}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const createdDate = getCreatedDate(item.created);
            const dateLabel = createdDate ? createdDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "short" }) : "--";

            return (
              <View style={[styles.item, { backgroundColor: colors.surface }]}>
                <View style={[styles.iconContainer, { backgroundColor: item.type === "exceeded-limit" ? "#ea580c" : "#ca8a04" }]}>
                  {item.type === "exceeded-limit" ? (
                    <Icons.WarningCircle
                      size={verticalScale(18)}
                      color="#fff"
                      weight="fill"
                    />
                  ) : (
                    <Icons.Warning
                      size={verticalScale(18)}
                      color="#fff"
                      weight="fill"
                    />
                  )}
                </View>

                <View style={styles.messageWrap}>
                  <Typo size={15} fontWeight={"600"}>{item.title}</Typo>
                  <Typo size={12} color={colors.textLight}>{item.description}</Typo>
                </View>

                <Typo size={12} color={colors.textLight}>{dateLabel}</Typo>
              </View>
            );
          }}
          ListEmptyComponent={
            !loading ? (
              <View style={[styles.emptyBox, { borderColor: colors.border }]}>
                <Typo size={14} color={colors.textLighter}>Chưa có thông báo nào</Typo>
              </View>
            ) : null
          }
          ListFooterComponent={
            hasMore ? (
              <TouchableOpacity
                style={[styles.loadMoreButton, { backgroundColor: colors.primary }]}
                onPress={() => fetchNotifications(true)}
                activeOpacity={0.85}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <ActivityIndicator color={colors.black} />
                ) : (
                  <Typo size={14} color={colors.black} fontWeight={"700"}>Xem thêm</Typo>
                )}
              </TouchableOpacity>
            ) : null
          }
        />

        {loading && (
          <View style={[
            styles.loadingWrap,
            { backgroundColor: isDarkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)" }
          ]}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        )}
      </View>
    </ModalWrapper>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  listContent: {
    gap: spacingY._12,
    paddingBottom: spacingY._20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._12,
    borderRadius: radius._12,
  },
  iconContainer: {
    height: verticalScale(38),
    width: verticalScale(38),
    borderRadius: radius._10,
    alignItems: "center",
    justifyContent: "center",
  },
  messageWrap: {
    flex: 1,
    gap: verticalScale(2),
  },
  emptyBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: radius._12,
    paddingVertical: spacingY._25,
    alignItems: "center",
    marginTop: verticalScale(20),
  },
  loadMoreButton: {
    marginTop: spacingY._20,
    marginBottom: spacingY._20,
    alignSelf: "center",
    borderRadius: radius._12,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._25,
  },
  loadingWrap: {
    position: "absolute",
    top: 0, right: 0, bottom: 0, left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});