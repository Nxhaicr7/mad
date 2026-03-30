import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { spacingX, spacingY } from "@/constants/theme"; // Bỏ import colors
import { useAuth } from "@/contexts/authContext";
import { useTheme } from "@/contexts/themeContext"; // Thêm hook theme
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { useTranslation } from "react-i18next"; // 1. Import hook dịch

const WalletModal = () => {
    const { t } = useTranslation(); // 2. Khai báo hàm t
    const { user, updateUserData } = useAuth();
    const router = useRouter();
    const { colors } = useTheme(); // Lấy bảng màu động

    // state
    const [wallet, setWallet] = useState<WalletType>({
        name: "",
        image: null,
    });

    const [loading, setLoading] = useState(false);

    const oldWallet: { name: string; image: string; id: string } =
        useLocalSearchParams();

    useEffect(() => {
        if (oldWallet?.id) {
            setWallet({
                name: oldWallet?.name,
                image: oldWallet?.image ?? null,
            });
        }
    }, [oldWallet?.id]);

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled && result.assets?.length > 0) {
        }
    };

    const onSubmit = async () => {
        let { name, image } = wallet;
        if (!name.trim()) {
            Alert.alert(t("Wallet"), t("Please enter a wallet name"));
            return;
        }

        const data: WalletType = {
            name,
            image,
            uid: user?.uid
        };
        if (oldWallet?.id) data.id = oldWallet?.id;
        setLoading(true);
        const res = await createOrUpdateWallet(data);
        setLoading(false);
        if (res.success) {
            router.back();
        } else {
            Alert.alert(t("Wallet"), res.msg);
        }
    };

    const onDelete = async () => {
        if (!oldWallet?.id) return;
        setLoading(true);
        const res = await deleteWallet(oldWallet?.id)
        setLoading(false);
        if (res.success) {
            router.back();
        } else {
            Alert.alert(t("Wallet"), res.msg);
        }
    };

    const showDeleteAlert = () => {
        Alert.alert(
            t("Confirm"),
            t("Are you sure you want to do this? \nThis action will remove all the transactions related to this wallet"),
            [
                {
                    text: t("Cancel"),
                    onPress: () => console.log("cancel delete"),
                    style: "cancel"
                },
                {
                    text: t("Delete"),
                    onPress: () => onDelete(),
                    style: "destructive"
                }
            ]
        );
    }

    // UI
    return (
        <ModalWrapper>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header
                    title={oldWallet?.id ? t("Update Wallet") : t("New Wallet")}
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }}
                />

                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.text}>{t("Wallet Name")}</Typo>
                        <Input
                            placeholder={t("Salary")}
                            value={wallet.name}
                            onChangeText={(value) =>
                                setWallet({ ...wallet, name: value })
                            }
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.text}>{t("Wallet Icon")}</Typo>
                        <ImageUpload
                            file={wallet.image}
                            onClear={() => setWallet({ ...wallet, image: null })}
                            onSelect={file => setWallet({ ...wallet, image: file })}
                            placeholder={t("Upload Image")} />
                    </View>
                </ScrollView>
            </View>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                {oldWallet?.id && !loading && (
                    <Button onPress={showDeleteAlert}
                        style={{
                            backgroundColor: colors.rose,
                            paddingHorizontal: spacingX._15,
                        }}
                    >
                        <Icons.Trash color={colors.white}
                            size={verticalScale(24)}
                            weight="bold"
                        />
                    </Button>
                )}
                <Button onPress={onSubmit} style={{ flex: 1 }} loading={loading}>
                    <Typo color={colors.black} fontWeight={"700"}>
                        {oldWallet?.id ? t("Update Wallet") : t("Add Wallet")}
                    </Typo>
                </Button>
            </View>
        </ModalWrapper>
    );
};

export default WalletModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
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
        marginTop: spacingY._15,
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center",
    },
    avatar: {
        alignSelf: "center",
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
    },
    editIcon: {
        position: "absolute",
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7,
    },
    inputContainer: {
        gap: spacingY._10,
    },
});