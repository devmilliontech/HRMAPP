import React from 'react'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LeaveRequestScreen from '../screens/rest-user/LeaveRequestScreen';
import ReportViewScreen from '../screens/rest-user/ReportViewScreen';
import SalaryoverviewScreen from '../screens/rest-user/SalaryoverviewScreen';
import BackButton from '../components/specific/BackButton';
import PerformanceRatingScreen from '../screens/rest-user/PerformanceRatingScreen';
import SettingNavigator from './SettingNavigator';
import SalaryCalcScreen from '../screens/rest-user/SalaryCalcScreen';
import HrDashboardNavigator from './HrDashboardNavigator';
import HomeNavigator from './HomeNavigator';
import { typography } from '../constants/typography';
import EmployeesScreen from '../screens/rest-user/EmployeesScreen';
import EmployeeNavigator from './EmployeesNavigator';
import LeaveCalendarScreen from '../screens/LeaveCalendarScreen';
import SalaryOverviewNavigator from './SalaryoverViewNavigator';
const Drawer = createDrawerNavigator()


const RestUserNavigator = () => {

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

            <Drawer.Screen name='Home' component={HomeNavigator} options={{
                headerShown: false, drawerIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color} />
                ),
            }} />

            <Drawer.Screen name='rest-user-dashboard' component={HrDashboardNavigator} options={({ navigation }) => ({
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                    <MaterialIcons name="privacy-tip" size={size} color={color} />
                ),
                title: "HR Central",
            })} />

            <Drawer.Screen name='Salarie' component={SalaryOverviewNavigator} options={({ navigation }) => ({
                headerLeft: () => (
                    <BackButton navigation={navigation} />
                ),
                drawerIcon: ({ color, size }) => (
                    <Ionicons name="cash" size={size} color={color} />
                ),
                title: "Salary Overview",
                headerShown: false
            })} />
            <Drawer.Screen name='SalaryCalc' component={SalaryCalcScreen} options={({ navigation }) => ({
                headerLeft: () => (
                    <BackButton navigation={navigation} />
                ),
                drawerIcon: ({ color, size }) => (
                    <Ionicons name="calculator" size={size} color={color} />
                ),
                title: "Salary Calculator",
            })} />

            <Drawer.Screen name='employees' component={EmployeeNavigator} options={({ navigation }) => ({
                headerLeft: () => (
                    <BackButton navigation={navigation} />
                ),
                drawerIcon: ({ color, size }) => (
                    <Ionicons name="people" size={size} color={color} />
                ),
                title: "Employees",
                headerShown: false
            })} />

            <Drawer.Screen name='LeaveCalender' component={LeaveCalendarScreen} options={({ navigation }) => ({
                headerLeft: () => <BackButton navigation={navigation} />,
                title: "Leave Calender",
                drawerIcon: ({ color, size }) => <Ionicons name='calendar-number' color={color} size={size} />
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

export default RestUserNavigator