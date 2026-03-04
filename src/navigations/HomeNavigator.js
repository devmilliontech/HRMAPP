import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Dashboard from '../screens/Dashboard'
import ApplyLeaves from '../screens/ApplyLeaves'
import { colors } from '../constants/colors'
import ReportScreen from '../screens/ReportScreen'
import SalaryScreen from '../screens/SalaryScreen'
import PerformanceScreen from '../screens/PerformanceScreen'
import NotificationScreen from '../screens/NotificationScreen'
import { typography } from '../constants/typography'
import AppText from '../components/common/AppText'
import { useDashboardStore } from '../store/useDashboardStore'
import { useApi } from '../hooks/useApi'
import notification from '../api/notification'
import ProfileScreen from '../screens/ProfileScreen'

const Stack = createNativeStackNavigator()


const HomeNavigator = () => {
    const { request } = useApi(notification.deleteAllNotification)
    const { data, setData } = useDashboardStore()
    const [loading, setLoading] = useState(false)

    const handleClearAll = async () => {
        setLoading(true)
        await request()
        await setData()
        setLoading(false)
    };

    return (
        <Stack.Navigator screenOptions={{
            headerTitleStyle: {
                fontFamily: typography.semiBold,
                fontSize: 18,
            },
            headerBackTitleStyle: {
                fontFamily: typography.medium
            }
        }}>
            <Stack.Screen name='Home' component={Dashboard} options={{ headerShown: false }} />
            <Stack.Screen name='Profile' component={ProfileScreen} />
            <Stack.Screen name='Notifications' component={NotificationScreen} options={{
                title: "Notifications",
                headerRight: () => (
                    loading ? <ActivityIndicator animating={true} color={colors.primary} /> : data?.notifications.length != 0 && <TouchableOpacity onPress={handleClearAll}>
                        <AppText style={{ color: colors.primary }}> Clear</AppText>
                    </TouchableOpacity>
                )
            }} />
            <Stack.Screen name='ApplyLeaves' component={ApplyLeaves} options={{
                title: "Apply Leaves",
            }} />
            <Stack.Screen name='ViewPaySlip' component={SalaryScreen} options={{ title: "Salary Overview" }} />

            <Stack.Screen name='DailyReports' component={ReportScreen} options={{
                title: "Daily Report",
            }} />
            <Stack.Screen name='Performance' component={PerformanceScreen} />
        </Stack.Navigator>
    )
}

export default HomeNavigator