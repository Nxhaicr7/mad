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
import { useTranslation } from "react-i18next";

const Register = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const nameRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const { register: registerUser, loginWithGoogle } = useAuth();

    const handleSubmit = async () => {
        if (!emailRef.current || !passwordRef.current || !nameRef.current) {
            Alert.alert(t("Sign up"), t("Please fill all the fields"));
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
            Alert.alert(t("Sign up"), res.msg);
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
                    <Typo size={30} fontWeight={"800"}>
                        {t("Let's")}
                    </Typo>
                    <Typo size={30} fontWeight={"800"}>
                        {t("Get started")}
                    </Typo>
                </View>

                <View style={styles.form}>
                    <Typo size={16} color={colors.textLight}>
                        {t("Create an account to track your expense")}
                    </Typo>

                    <Input
                        placeholder={t("Enter your name")}
                        onChangeText={(value) => (nameRef.current = value)}
                        icon={
                            <Icons.User
                                size={verticalScale(26)}
                                color={colors.neutral300}
                                weight="fill"
                            />
                        }
                    />

                    <Input
                        placeholder={t("Enter your email")}
                        onChangeText={(value) => (emailRef.current = value)}
                        icon={
                            <Icons.At
                                size={verticalScale(26)}
                                color={colors.neutral300}
                                weight="fill"
                            />
                        }
                    />

                    <Input
                        placeholder={t("Enter your password")}
                        secureTextEntry
                        onChangeText={(value) => (passwordRef.current = value)}
                        icon={
                            <Icons.Lock
                                size={verticalScale(26)}
                                color={colors.neutral300}
                                weight="fill"
                            />
                        }
                    />

                    <Button loading={isLoading} onPress={handleSubmit}>
                        <Typo fontWeight={"700"} color={colors.black} size={21}>
                            {t("Sign up")}
                        </Typo>
                    </Button>
                </View>

                {/* --- Divider "Or" --- */}
                <View style={styles.dividerContainer}>
                    <View style={[styles.dividerLine, { backgroundColor: colors.neutral300 }]} />
                    <Typo size={14} color={colors.textLight} style={{ paddingHorizontal: 10 }}>
                        {t("Or")}
                    </Typo>
                    <View style={[styles.dividerLine, { backgroundColor: colors.neutral300 }]} />
                </View>

                {/* --- Social Register Buttons --- */}
                <View style={styles.socialContainer}>
                    {/* Nút Google */}
                    <TouchableOpacity
                        style={[styles.socialButton, { borderColor: colors.neutral300 }]}
                        onPress={handleGoogleRegister}
                    >
                        <Icons.GoogleLogo size={verticalScale(24)} color={colors.text} weight="bold" />
                        <Typo size={16} fontWeight={"600"} color={colors.text}>
                            {t("Continue with Google")}
                        </Typo>
                    </TouchableOpacity>

                    {/* Nút Facebook */}
                    <TouchableOpacity
                        style={[styles.socialButton, { borderColor: colors.neutral300 }]}
                        onPress={handleFacebookRegister}
                    >
                        <Icons.FacebookLogo size={verticalScale(24)} color="#1877F2" weight="fill" />
                        <Typo size={16} fontWeight={"600"} color={colors.text}>
                            {t("Continue with Facebook")}
                        </Typo>
                    </TouchableOpacity>
                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Typo size={15} color={colors.textLight}>{t("Already have an account?")}</Typo>

                    <Pressable onPress={() => router.navigate("/(auth)/Login")}>
                        <Typo size={15} fontWeight={"700"} color={colors.primary}>
                            {t("Login")}
                        </Typo>
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