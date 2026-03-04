import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AttendanceScreen from '../screens/rest-user/AttendanceScreen'
import HrDashboard from '../screens/rest-user/HomeScreen'
import PerformanceRatingScreen from '../screens/rest-user/PerformanceRatingScreen'
import ProfileScreen from '../screens/ProfileScreen'
import LeaveRequestScreen from '../screens/rest-user/LeaveRequestScreen'
import AddEmployeeScreen from '../screens/rest-user/AddEmployeeScreen'
import ReportViewScreen from '../screens/rest-user/ReportViewScreen'
import { typography } from '../constants/typography'

const Stack = createNativeStackNavigator()

const HrDashboardNavigator = () => {
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
            <Stack.Screen name='hrDashboard' component={HrDashboard} options={{ headerShown: false }} />
            <Stack.Screen name='leave-requests' component={LeaveRequestScreen} options={{ title: "Leave Requests" }} />
            <Stack.Screen name='getAllAttendance' component={AttendanceScreen} options={{
                title: "Attendance"
            }} />
            <Stack.Screen name='PerformanceRating' component={PerformanceRatingScreen} options={{
                title: "Performance Rating"
            }} />
            <Stack.Screen name='AddEmployee' component={AddEmployeeScreen} options={{
                title: "Add New Employee"
            }} />
            <Stack.Screen name='viewReports' component={ReportViewScreen} options={{
                title: "View Reports"
            }} />
            <Stack.Screen name='Profile' component={ProfileScreen} />
        </Stack.Navigator>
    )
}

export default HrDashboardNavigator