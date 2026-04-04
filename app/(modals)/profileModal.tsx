import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useTheme } from "@/contexts/themeContext";
import { getProfileImage } from "@/services/imageServices";
import { updateUser } from "@/services/userServices";
import { UserDataType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileModal = () => {
  const { user, updateUserData } = useAuth();
  const { colors, isDarkMode } = useTheme();
  const router = useRouter();

  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setUserData({ ...userData, image: result.assets[0].uri });
    }
  };

  const onSubmit = async () => {
    if (!userData.name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên của bạn");
      return;
    }
    setLoading(true);
    const res = await updateUser(user?.uid as string, userData);
    setLoading(false);

    if (res.success) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("Lỗi", res.msg);
    }
  };

  useEffect(() => {
    setUserData({ name: user?.name || "", image: user?.image || null });
  }, [user]);

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Cập nhật thông tin"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            <Image
              style={[
                styles.avatar,
                { backgroundColor: colors.neutral200, borderColor: colors.border }
              ]}
              source={getProfileImage(userData.image)}
              contentFit="cover"
              transition={100}
            />

            <TouchableOpacity
              onPress={onPickImage}
              style={[styles.editIcon, { backgroundColor: colors.neutral200 }]}
            >
              <Icons.Pencil
                size={verticalScale(20)}
                color={colors.primary}
                weight="bold"
              />
            </TouchableOpacity>
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <Typo color={colors.textLight} size={16}>Tên hiển thị</Typo>
            <Input
              placeholder="Nhập tên của bạn"
              value={userData.name}
              onChangeText={(value) => setUserData({ ...userData, name: value })}
            />
          </View>
        </ScrollView>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Button onPress={onSubmit} style={{ flex: 1 }} loading={loading}>
          <Typo color={colors.black} fontWeight={"700"} size={18}>
            Cập nhật
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._20,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
    marginTop: verticalScale(10),
  },
  avatar: {
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 100,
    padding: spacingY._7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});