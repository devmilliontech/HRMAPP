import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import AppText from '../../components/common/AppText'
import { STYLES } from '../../constants/styles'
import SectionHeader from '../../components/specific/SectionHeader'
import AppSlider from '../../components/specific/AppSlider'
import ProgressBar from '../../components/specific/ProgressBar'
import { colors } from '../../constants/colors'
import Card from '../../layout/Card'

const getScoreColor = (score) => {
    if (score >= 90) return colors.success;
    if (score >= 80) return colors.pending;
    else return colors.danger
}

const getLabel = (score) => {
    if (score >= 90) return "Very Good";
    if (score >= 80) return "Good";
    else return "Needs Improvement"
}
const PerformanceReviewSummary = ({ formData }) => {

    const presentDays = formData?.presentDays;
    const absentDays = formData?.absentDays;
    const lateArrivalDays = formData?.lateArrivalDays;
    const totalTasks = formData?.totalProjects;
    const completedTasks = formData?.completedProjects;
    const negativeFeedback = formData?.clientNegativeFeedback;
    const positiveFeedback = formData?.clientPositiveFeedback;
    const totalDays = presentDays + absentDays;

    const attendanceScore = ((presentDays / totalDays) * 100).toFixed(2) || 0
    const ontimeArrivalScore = ((((presentDays - lateArrivalDays) / presentDays)) * 100).toFixed(2) || 0
    const TaskCompletionScore = ((completedTasks / totalTasks) * 100).toFixed(2) || 0
    const clientSatisfactionScore = (((positiveFeedback) / (positiveFeedback + negativeFeedback)) * 100).toFixed(2) || 0
    const hrComment = ((formData?.workQuality / 10) * 100).toFixed(2) || 0

    return (
        <View>
            <SectionHeader icon={"bar-chart"} iconColor={"#ac00f5"} title={"Performance Review Summary"} />
            <ScoreCard header={"Attendance Rate"} score={attendanceScore} rate={`${presentDays}/${totalDays}`} flag={"days"} />
            <ScoreCard header={"On-Time Arrival"} score={ontimeArrivalScore} rate={`${presentDays - lateArrivalDays}/${presentDays}`} flag={"on time"} />
            <ScoreCard header={"Task Completion Rate"} score={TaskCompletionScore} rate={`${completedTasks}/${totalTasks}`} flag={"tasks"} />
            <ScoreCard header={"Client Satisfaction"} score={clientSatisfactionScore} rate={`${positiveFeedback}/${positiveFeedback + negativeFeedback}`} flag={"Client feedback"} />
            <ScoreCard header={"Hr Feedback"} score={hrComment} rate={`${formData?.workQuality}/10`} flag={"out of 100"} />
        </View>
    )
}

const ScoreCard = ({ header, score, rate, flag }) => {

    return (
        <Card>
            <View style={styles.row}>

                {/* LEFT SIDE */}
                <View style={styles.left}>
                    <AppText
                        numberOfLines={2}
                        style={styles.label}
                    >
                        {header}
                    </AppText>
                </View>

                {/* RIGHT SIDE */}
                <View style={styles.right}>

                    <View style={styles.statusRow}>
                        <View
                            style={[
                                styles.dot,
                                { backgroundColor: getScoreColor(score) }
                            ]}
                        />
                        <AppText
                            style={{
                                color: getScoreColor(score),
                                fontSize: 15
                            }}
                        >
                            {getLabel(score)}
                        </AppText>
                    </View>

                    <AppText
                        style={[
                            styles.score,
                            { color: getScoreColor(score) }
                        ]}
                    >
                        {score}%
                    </AppText>

                    <AppText style={styles.rate}>
                        {rate} {flag}
                    </AppText>
                </View>
            </View>

            <ProgressBar
                value={Number(score)}
                bgColor={getScoreColor(score)}
            />
        </Card>
    );
};


const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    left: {
        flex: 1,
        paddingRight: 10,
    },

    right: {
        alignItems: "flex-end",
        minWidth: 110, // prevents overflow
    },

    label: {
        marginBottom: 8,
        flexShrink: 1,
    },

    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },

    dot: {
        height: 10,
        width: 10,
        borderRadius: 20,
        marginRight: 6,
    },

    score: {
        fontSize: 20,
        fontWeight: "700",
        marginVertical: 6,
    },

    rate: {
        fontSize: 14,
        color: colors.medium,
        marginBottom: 12,
        textAlign: "right",
    },
});

export default PerformanceReviewSummary