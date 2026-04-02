import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { spacingX, spacingY } from "@/constants/theme"; // ⚠️ Đã bỏ import colors tĩnh
import { useAuth } from "@/contexts/authContext";
import { useTheme } from "@/contexts/themeContext"; // 👈 Thêm import useTheme
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";


const Register = () => {

    const { colors, isDarkMode } = useTheme();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const nameRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const { register: registerUser, loginWithGoogle } = useAuth();

    const handleSubmit = async () => {
        if (!emailRef.current || !passwordRef.current || !nameRef.current) {
            Alert.alert(("Đăng kí"), ("Vui lòng điền đầy đủ thông tin vào tất cả các ô"));
            return;
        }

        setIsLoading(true);
        const res = await registerUser(
            emailRef.current,
            passwordRef.current,
            nameRef.current
        );
        setIsLoading(false);
        console.log("register result: ", res);
        if (!res.success) {
            Alert.alert(("Đăng kí"), res.msg);
        }
    };

    const handleGoogleRegister = async () => {
        const res = await loginWithGoogle();
        if (!res.success) {
            alert(res.msg);
        }
    };

    const handleFacebookRegister = async () => {
        console.log("Register with Facebook pressed");
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <BackButton iconSize={28} />

                <View style={{ gap: 5, marginTop: spacingY._20 }}>
                    <Typo size={30} fontWeight={"800"}>Sẵn sàng</Typo>
                    <Typo size={30} fontWeight={"800"}>Bắt đầu nào</Typo>
                </View>

                <View style={styles.form}>
                    <Typo size={16} color={colors.textLight}>
                        Tạo tài khoản để theo dõi chi phí của bạn
                    </Typo>

                    <Input
                        placeholder={"Nhập tên của bạn"}
                        onChangeText={(value) => (nameRef.current = value)}
                        icon={
                            <Icons.User
                                size={verticalScale(26)}
                                color={colors.textLight} // 👈 Sửa cho nét
                                weight="fill"
                            />
                        }
                    />

                    <Input
                        placeholder={"Nhập email của bạn"}
                        onChangeText={(value) => (emailRef.current = value)}
                        icon={
                            <Icons.At
                                size={verticalScale(26)}
                                color={colors.textLight} // 👈 Sửa cho nét
                                weight="fill"
                            />
                        }
                    />

                    <Input
                        placeholder={"Nhập mật khẩu của bạn"}
                        secureTextEntry
                        onChangeText={(value) => (passwordRef.current = value)}
                        icon={
                            <Icons.Lock
                                size={verticalScale(26)}
                                color={colors.textLight} // 👈 Sửa cho nét
                                weight="fill"
                            />
                        }
                    />

                    <Button loading={isLoading} onPress={handleSubmit}>
                        <Typo fontWeight={"700"} color={colors.black} size={21}>
                            Đăng kí
                        </Typo>
                    </Button>
                </View>

                {/* Divider Line - Đã fix màu border */}
                <View style={styles.dividerContainer}>
                    <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                    <Typo size={14} color={colors.textLight} style={{ paddingHorizontal: 10 }}>
                        hoặc
                    </Typo>
                    <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                </View>

                {/* Social Buttons - Đã fix viền nút */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity
                        style={[styles.socialButton, { borderColor: colors.border }]}
                        onPress={handleGoogleRegister}
                    >
                        <Icons.GoogleLogo size={verticalScale(24)} color={colors.text} weight="bold" />
                        <Typo size={16} fontWeight={"600"} color={colors.text}>
                            Tiếp tục với Google
                        </Typo>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.socialButton, { borderColor: colors.border }]}
                        onPress={handleFacebookRegister}
                    >
                        <Icons.FacebookLogo size={verticalScale(24)} color="#1877F2" weight="fill" />
                        <Typo size={16} fontWeight={"600"} color={colors.text}>
                            Tiếp tục với Facebook
                        </Typo>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Typo size={15} color={colors.textLight}>Đã có tài khoản ?</Typo>
                    <Pressable onPress={() => router.navigate("/(auth)/Login")}>
                        <Typo size={15} fontWeight={"700"} color={colors.primary}> Đăng nhập</Typo>
                    </Pressable>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._20,
        paddingHorizontal: spacingX._20,
    },
    form: {
        gap: spacingY._20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        marginTop: verticalScale(10),
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: verticalScale(5),
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    socialContainer: {
        gap: spacingY._15,
    },
    socialButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        height: verticalScale(50),
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: "transparent",
    },
});