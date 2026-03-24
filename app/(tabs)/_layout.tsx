import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from '@/contexts/themeContext'; // 1. Gọi hook theme
import * as Icons from 'phosphor-react-native';

export default function TabLayout() {
    const { colors } = useTheme(); // 2. Lấy bảng màu động

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                // 3. Truyền màu động vào thanh Tab Bar
                tabBarStyle: {
                    backgroundColor: colors.background, // Màu nền của thanh điều hướng
                    borderTopColor: colors.border,      // Viền trên
                },
                tabBarActiveTintColor: colors.primary,      // Màu khi icon được chọn
                tabBarInactiveTintColor: colors.textLight,  // Màu khi icon chưa chọn
                tabBarShowLabel: false, // Ẩn chữ bên dưới icon nếu muốn
            }}
        >
            {/* Cấu hình các màn hình của bạn ở đây, ví dụ: */}
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color }) => <Icons.House size={26} color={color} weight="fill" />,
                }}
            />
            <Tabs.Screen
                name="statistics"
                options={{
                    tabBarIcon: ({ color }) => <Icons.ChartBar size={26} color={color} weight="fill" />,
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    tabBarIcon: ({ color }) => <Icons.Wallet size={26} color={color} weight="fill" />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color }) => <Icons.User size={26} color={color} weight="fill" />,
                }}
            />
        </Tabs>
    );
}