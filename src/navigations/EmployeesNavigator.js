import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { typography } from '../constants/typography'
import EmployeeDetailScreen from '../screens/rest-user/EmployeeDetailsScreen'
import EmployeesScreen from '../screens/rest-user/EmployeesScreen'
import BackButton from '../components/specific/BackButton'
import { FontAwesome6, Ionicons } from '@expo/vector-icons'
import { colors } from '../constants/colors'
import AddEmployeeScreen from '../screens/rest-user/AddEmployeeScreen'

const Stack = createNativeStackNavigator()


const EmployeeNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerTitleStyle: {
                fontFamily: typography.semiBold,
                fontSize: 18,
            },
            headerBackTitleStyle: {
                fontFamily: typography.medium
            },
        }}>
            <Stack.Screen name='Employees' component={EmployeesScreen} options={({ navigation }) => ({
                title: "All Employee",
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 0, marginRight: 8 }}>
                        <FontAwesome6
                            name="arrow-left"
                            size={20}
                        />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("AddEmployee")}>
                        <Ionicons name='add-circle-outline' size={32} color={colors.primary} />
                    </TouchableOpacity>
                )
            })} />
            <Stack.Screen name='EmployeeDetails' component={EmployeeDetailScreen} options={{ title: "Employee Details" }} />
            <Stack.Screen name='AddEmployee' component={AddEmployeeScreen} options={{
                title: "Add New Employee"
            }} />

        </Stack.Navigator>
    )
}

export default EmployeeNavigator