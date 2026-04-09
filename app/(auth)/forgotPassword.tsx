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


const ForgotPassword = () => {

    const { colors } = useTheme();
    const emailRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { resetPassword } = useAuth();

    const handleSendLink = async () => {
        if (!emailRef.current) {
            Alert.alert(("Quên mật khẩu"), ("Vui lòng nhập email của bạn"));
            return;
        }

        setIsLoading(true);
        const res = await resetPassword(emailRef.current);
        setIsLoading(false);

        if (res.success) {
            Alert.alert(
                ("Thành công"),
                res.msg,
                [{ text: "OK", onPress: () => router.back() }]
            );
        } else {
            Alert.alert(("Lỗi"), res.msg);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <BackButton iconSize={28} />

                {/* Tiêu đề */}
                <View style={{ gap: 5, marginTop: spacingY._20 }}>
                    <Typo size={30} fontWeight={"800"}>
                        {("Reset")}
                    </Typo>
                    <Typo size={30} fontWeight={"800"}>
                        {("Password")}
                    </Typo>
                </View>

                {/* Form nhập liệu */}
                <View style={styles.form}>
                    <Typo size={16} color={colors.textLight}>
                        {("Nhập email bạn đã đăng ký để nhận liên kết đặt lại mật khẩu.")}
                    </Typo>

                    <Input
                        placeholder={("Nhập email của bạn")}
                        onChangeText={(value) => (emailRef.current = value)}
                        icon={
                            <Icons.At
                                size={verticalScale(26)}
                                color={colors.textLight}
                                weight="fill"
                            />
                        }
                    />

                    <Button loading={isLoading} onPress={handleSendLink}>
                        <Typo fontWeight={"700"} color={colors.black} size={21}>
                            {("Gửi liên kết")}
                        </Typo>
                    </Button>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20,
    },
    form: {
        gap: spacingY._20,
        marginTop: spacingY._10,
    },
});