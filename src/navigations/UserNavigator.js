import React from 'react'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HomeNavigator from './HomeNavigator';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BackButton from '../components/specific/BackButton';
import SettingNavigator from './SettingNavigator';
import { typography } from '../constants/typography';
import LeaveCalendarScreen from '../screens/LeaveCalendarScreen';

const Drawer = createDrawerNavigator()


const UserNavigator = () => {

    return (
        <Drawer.Navigator screenOptions={{
            headerTitleStyle: {
                fontFamily: typography.semiBold,
            },
            drawerLabelStyle: {
                fontFamily: typography.medium,
                fontSize: 15,
            },
        }}>
            <Drawer.Screen name='HomeNavigator' component={HomeNavigator} options={{
                drawerIcon: ({ color, size }) => <MaterialCommunityIcons name='home' size={size} color={color} />,
                title: "Home",
                headerShown: false
            }} />

            <Drawer.Screen name='LeaveCalender' component={LeaveCalendarScreen} options={({ navigation }) => ({
                headerLeft: () => <BackButton navigation={navigation} />,
                title: "Leave Calender",
                drawerIcon: ({ color, size }) => <Ionicons name='calendar-number' color={color} size={size} />,
                // headerShown: false
            })} />

            <Drawer.Screen name='SettingNavigator' component={SettingNavigator} options={({ navigation }) => ({
                headerLeft: () => <BackButton navigation={navigation} />,
                title: "Settings",
                drawerIcon: ({ color, size }) => <Ionicons name='settings' color={color} size={size} />,
                headerShown: false
            })} />

        </Drawer.Navigator>
    )
}

export default UserNavigator