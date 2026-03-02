import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { typography } from '../constants/typography'
import SalaryoverviewScreen from '../screens/rest-user/SalaryoverviewScreen'
import EmployeeSalaryBreakdown from '../screens/rest-user/EmployeeSalaryBreakDown'
import { TouchableOpacity } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons'

const Stack = createNativeStackNavigator()


const SalaryOverviewNavigator = () => {
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
            <Stack.Screen name='Salary Overview' component={SalaryoverviewScreen} options={({ navigation }) => ({
                title: "Salary Overview",
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 0, marginRight: 8 }}>
                        <FontAwesome6
                            name="arrow-left"
                            size={20}
                        />
                    </TouchableOpacity>
                ),
            })} />

            <Stack.Screen name='salarybreakdown' component={EmployeeSalaryBreakdown} options={{
                title: "Salary Breakdown"
            }} />
        </Stack.Navigator>
    )
}

export default SalaryOverviewNavigator