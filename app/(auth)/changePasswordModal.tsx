import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useTheme } from "@/contexts/themeContext";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";


const ChangePasswordModal = () => {
    const { colors } = useTheme();

    const router = useRouter();

    const { changePassword, logout } = useAuth();
    const newPasswordRef = useRef("");
    const confirmPasswordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);



    const handleUpdate = async () => {
        const newPass = newPasswordRef.current;
        const confirmPass = confirmPasswordRef.current;

        if (!newPass || !confirmPass) {
            Alert.alert(("Lỗi"), ("Vui lòng điền đầy đủ 2 ô mật khẩu!"));
            return;
        }

        if (newPass.length < 6) {
            Alert.alert(("Lỗi"), ("Mật khẩu phải có ít nhất 6 ký tự!"));
            return;
        }

        if (newPass !== confirmPass) {
            Alert.alert(("Lỗi"), ("Hai mật khẩu không khớp nhau!"));
            return;
        }

        setIsLoading(true);
        const res = await changePassword(newPass);
        setIsLoading(false);

        if (res.success) {
            Alert.alert(
                ("Thành công"),
                ("Đổi mật khẩu thành công! Vui lòng đăng nhập lại với mật khẩu mới."),
                [
                    {
                        text: "OK",

                        onPress: async () => {
                            await logout();

                        }
                    }
                ]
            );
        } else {
            Alert.alert(("Thất bại"), res.msg);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton iconSize={28} />
                    <Typo size={20} fontWeight={"700"}>
                        {("Đổi mật khẩu")}
                    </Typo>
                    <View style={{ width: 28 }} />
                </View>

                <View style={styles.form}>
                    <Typo size={16} color={colors.textLight} style={{ marginBottom: 10 }}>
                        {("Mật khẩu mới của bạn phải có ít nhất 6 ký tự để đảm bảo an toàn.")}
                    </Typo>

                    <Input
                        placeholder={("Nhập mật khẩu mới")}
                        secureTextEntry
                        onChangeText={(value) => (newPasswordRef.current = value)}
                        icon={
                            <Icons.LockKey
                                size={verticalScale(26)}
                                color={colors.textLight}
                                weight="fill"
                            />
                        }
                    />

                    <Input
                        placeholder={("Xác nhận mật khẩu mới")}
                        secureTextEntry
                        onChangeText={(value) => (confirmPasswordRef.current = value)}
                        icon={
                            <Icons.LockKey
                                size={verticalScale(26)}
                                color={colors.textLight}
                                weight="fill"
                            />
                        }
                    />

                    <Button loading={isLoading} onPress={handleUpdate} style={{ marginTop: 10 }}>
                        <Typo fontWeight={"700"} color={colors.black} size={21}>
                            {("Cập nhật")}
                        </Typo>
                    </Button>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default ChangePasswordModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: spacingY._10,
        marginBottom: spacingY._20,
    },
    form: {
        gap: spacingY._20,
    },
});