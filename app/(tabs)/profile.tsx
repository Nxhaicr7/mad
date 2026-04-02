import Header from '@/components/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { auth } from '@/config/firebase'
import { radius, spacingX, spacingY } from '@/constants/theme' // Bỏ import colors tĩnh ở đây
import { useAuth } from '@/contexts/authContext'
import { useTheme } from '@/contexts/themeContext' // Thêm hook theme
import { getProfileImage } from '@/services/imageServices'
import { accountOptionType } from '@/types'
import { verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { signOut } from 'firebase/auth'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'


const Profile = () => {


    const { colors } = useTheme();
    const { user, logout } = useAuth();

    const accountOptions: accountOptionType[] = [
        {
            title: ("Chỉnh sửa thông tin"),
            icon: <Icons.User size={26} color={colors.white} weight="fill" />,
            routeName: "/(modals)/profileModal",
            bgColor: "#6366f1",
        },
        {
            title: ("Cài đặt"),
            icon: <Icons.GearSix size={26} color={colors.white} weight="fill" />,
            routeName: "/(modals)/settingsModal",
            bgColor: "#059669",
        },
        {
            title: ("Chính sách bảo mật"),
            icon: <Icons.Lock size={26} color={colors.white} weight="fill" />,
            routeName: "/(modals)/privacyModal",
            bgColor: '#9ca3af'
        },
        {
            title: ("Đăng xuất"),
            icon: <Icons.Power size={26} color={colors.white} weight="fill" />,

            bgColor: "#e11d48",
        },
    ];

    const handleLogout = async () => {
        await signOut(auth);
    };

    const showLogoutAlert = () => {
        Alert.alert(
            ('Xác nhận đăng xuất ?'),
            ('Bạn có chắc muốn đăng xuất ?'),
            [
                {
                    text: ('Hủy'),
                    style: 'cancel',
                },
                {
                    text: ('Đăng xuất'),
                    style: 'destructive',

                    onPress: async () => {
                        await logout();

                    },
                },
            ]
        );
    };

    const handlePress = (item: accountOptionType) => {
        if (item.title == ('Đăng xuất')) {
            showLogoutAlert();
        } else if (item.routeName) {
            router.push(item.routeName);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Header title="Profile" style={{ marginVertical: spacingY._10 }} />

                {/* user info */}
                <View style={styles.userInfo}>
                    {/* avatar */}
                    <View>
                        {/* user image */}
                        <Image
                            source={getProfileImage(user?.image)}
                            style={[styles.avatar, { backgroundColor: colors.neutral300 }]}
                            contentFit="cover"
                            transition={100}
                        />
                    </View>

                    {/* name & email */}
                    <View style={styles.nameContainer}>

                        <Typo size={24} fontWeight={"600"} color={colors.text}>
                            {user?.name}
                        </Typo>

                        <Typo size={15} color={colors.textLight}>
                            {user?.email}
                        </Typo>
                    </View>
                </View>

                {/*account options */}
                <View style={styles.accountOptions}>
                    {accountOptions.map((item, index) => {
                        return (
                            <Animated.View
                                key={index.toString()}
                                entering={FadeInDown.delay(index * 50)
                                    .springify()
                                    .damping(14)
                                }
                                style={styles.listItem}>
                                <TouchableOpacity style={styles.flexRow} onPress={() => handlePress(item)}>
                                    { }
                                    <View
                                        style={[
                                            styles.listIcon,
                                            {
                                                backgroundColor: item?.bgColor,
                                            },
                                        ]}
                                    >
                                        {item.icon && item.icon}
                                    </View>


                                    <Typo size={16} style={{ flex: 1 }} fontWeight={"500"} color={colors.text}>
                                        {item.title}
                                    </Typo>

                                    <Icons.CaretRight
                                        size={verticalScale(20)}
                                        weight="bold"
                                        color={colors.textLight}
                                    />
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>
            </View>
        </ScreenWrapper>
    );
};
export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
    },
    userInfo: {
        marginTop: verticalScale(30),
        alignItems: "center",
        gap: spacingY._15,
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
    },
    editIcon: {
        position: "absolute",
        bottom: 5,
        right: 8,
        borderRadius: 50,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: 5,
    },
    nameContainer: {
        gap: verticalScale(4),
        alignItems: "center",
    },
    listIcon: {
        height: verticalScale(44),
        width: verticalScale(44),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius._15,
        borderCurve: "continuous",
    },
    listItem: {
        marginBottom: verticalScale(17),
    },
    accountOptions: {
        marginTop: spacingY._35,
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._10,
    },
});
