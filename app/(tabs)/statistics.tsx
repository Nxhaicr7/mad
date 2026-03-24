import ScreenWrapper from '@/components/ScreenWrapper'
import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { useTranslation } from "react-i18next"; // 1. Import hook dịch

const Statistics = () => {
    const { t } = useTranslation(); // 2. Khai báo hàm t

    return (
        <ScreenWrapper>
            <Text>{t("Statistics")}</Text>
        </ScreenWrapper>
    )
}

export default Statistics

const styles = StyleSheet.create({})