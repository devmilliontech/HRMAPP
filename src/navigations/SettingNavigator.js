import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from '../screens/ProfileScreen'
import SettingsScreen from '../screens/SettingsScreen'
import PerformanceParametersScreen from '../screens/rest-user/PerformanceParametersScreen'
import NotificationSettingScreen from '../screens/NotificationSettingScreen'
import { typography } from '../constants/typography'
import AboutAppScreen from '../screens/AboutAppScreen'

const Stack = createNativeStackNavigator()


const SettingNavigator = () => {
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
            <Stack.Screen name='Setting' component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Profile' component={ProfileScreen} />
            <Stack.Screen name='NotificationSetting' component={NotificationSettingScreen} options={{
                title: "Notification Setting"
            }} />
            <Stack.Screen name='aboutUs' component={AboutAppScreen} options={{
                title: "About us"
            }} />
        </Stack.Navigator>
    )
}

export default SettingNavigator