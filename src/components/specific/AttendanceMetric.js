import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import SectionHeader from './SectionHeader'
import Card from '../../layout/Card'
import AppText from '../common/AppText'
import AppTextField from '../common/AppTextField'


const AttendanceMetric = ({ formData, onChange }) => {

    return (
        <>
            <Card>
                <SectionHeader title={"Attendance Metrics"} icon={"bar-chart-outline"} iconColor={"#ba0cff"} />

                <View style={styles.row}>
                    <View style={styles.width}>
                        <AppText style={styles.label}>Total Days Present</AppText>
                        <AppTextField value={formData?.presentDays} onChangeText={(text) => onChange("presentDays", text)} placeholder="0" keyboardType="numeric" />
                    </View>
                    <View style={styles.width}>
                        <AppText style={styles.label}>Total Days Absent</AppText>
                        <AppTextField value={formData?.absentDays} onChangeText={(text) => onChange("absentDays", text)} placeholder="0" keyboardType="numeric" />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.width}>
                        <AppText style={styles.label}>Total Half Days</AppText>
                        <AppTextField value={formData?.halfDays} onChangeText={(text) => onChange("halfDays", text)} placeholder="0" name={"halfDays"} keyboardType="numeric" />
                    </View>
                    <View style={styles.width}>
                        <AppText style={styles.label}>Total Late Arrivals</AppText>
                        <AppTextField value={formData?.lateArrivalDays} onChangeText={(text) => onChange("lateArrivalDays", text)} placeholder="0" name={"lateArrivals"} keyboardType="numeric" />
                    </View>
                </View>

                <AppText style={styles.label}>Total Uninfromed Leaves</AppText>
                <AppTextField value={formData?.uninformedLeaves} onChangeText={(text) => onChange("uninformedLeaves", text)} placeholder="0" name={"uninformedLeaves"} keyboardType="numeric" />

                <View style={{ marginBottom: 20 }} />
                <AppText style={styles.label}>Total Work-from-Home Days</AppText>
                <AppTextField value={formData?.wfhDays} onChangeText={(text) => onChange("wfhDays", text)} placeholder="0" name={"wfhDays"} keyboardType="numeric" />

            </Card>
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },
    width: {
        width: "48%"
    },
    label: {
        marginBottom: 8,
    },
})
export default AttendanceMetric