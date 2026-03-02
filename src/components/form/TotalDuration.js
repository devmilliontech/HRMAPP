import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useFormikContext } from 'formik'
import moment, { duration } from 'moment'
import { colors } from '../../constants/colors'
import AppText from '../common/AppText'

const TotalDuration = () => {
    const { values } = useFormikContext()

    if (!values.startDate || !values.endDate) {
        return
    }

    const days = moment(values.endDate).diff(moment(values.startDate), "days") + 1;
    return (
        <View style={styles.flag}>
            <AppText style={styles.duration}>Total Duration</AppText>
            <AppText style={styles.days}>{days} days</AppText>
        </View>
    )
}

const styles = StyleSheet.create({
    flag: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.light,
        padding: 12,
        borderRadius: 12,
    },
    duration: {
        color: colors.medium
    },
    days: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.primary
    }
})

export default TotalDuration