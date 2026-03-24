import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '@/constants/theme';

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: (value: boolean) => void;
    colors: typeof lightColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // Lấy theme mặc định của hệ thống điện thoại
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

    // Chuyển đổi bảng màu dựa trên state
    const colors = isDarkMode ? darkColors : lightColors;

    const toggleTheme = (value: boolean) => {
        setIsDarkMode(value);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};