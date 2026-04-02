import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from '@/contexts/themeContext';
import * as Icons from 'phosphor-react-native';

export default function TabLayout() {
    const { colors } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textLight,
                tabBarShowLabel: false,
            }}
        >

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