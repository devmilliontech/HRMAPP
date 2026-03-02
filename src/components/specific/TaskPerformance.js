import { View, Text, StyleSheet } from "react-native";
import React from "react";
import AppText from "../common/AppText";
import { colors } from "../../constants/colors";
import { STYLES } from "../../constants/styles";
import Counter from "./Counter";
import Card from "../../layout/Card";
import SectionHeader from "./SectionHeader";
import { Ionicons } from "@expo/vector-icons";

const TaskPerformance = ({ formData, onChange }) => {

    const taskRate = (formData?.completedProjects / formData?.totalProjects).toFixed(2) * 100 || 0;

    return (
        <View style={styles.container}>
            <SectionHeader
                icon={"apps"}
                title={"Task Performance Metrics"}
                iconColor={"#004cff"}
            />
            <Card>
                <View style={styles.row}>
                    <Counter
                        width={"48%"}
                        onDecrese={() =>
                            onChange("totalProjects", formData?.totalProjects - 1)
                        }
                        onIncrease={() =>
                            onChange("totalProjects", formData?.totalProjects + 1)
                        }
                        label={"Total Tasks/Projects"}
                        value={formData?.totalProjects}
                    />
                    <Counter
                        width={"48%"}
                        onDecrese={() =>
                            onChange("completedProjects", formData?.completedProjects - 1)
                        }
                        onIncrease={() =>
                            onChange("completedProjects", formData?.completedProjects + 1)
                        }
                        label={"Completed"}
                        value={formData?.completedProjects}
                    />
                </View>

                <View style={styles.row}>
                    <Counter
                        width={"48%"}
                        onDecrese={() =>
                            onChange("carrieForward", formData?.carrieForward - 1)
                        }
                        onIncrease={() =>
                            onChange("carrieForward", formData?.carrieForward + 1)
                        }
                        label={"Carried Forward"}
                        value={formData?.carrieForward}
                    />
                    <Counter
                        width={"48%"}
                        onDecrese={() =>
                            onChange("missedDeadLine", formData?.missedDeadLine - 1)
                        }
                        onIncrease={() =>
                            onChange("missedDeadLine", formData?.missedDeadLine + 1)
                        }
                        label={"Missed Deadlines"}
                        value={formData?.missedDeadLine}
                    />
                </View>

                <Counter
                    onDecrese={() =>
                        onChange("completedBeforeDeadline", formData?.completedBeforeDeadline - 1)
                    }
                    onIncrease={() =>
                        onChange("completedBeforeDeadline", formData?.completedBeforeDeadline + 1)
                    }
                    label={"Completed Before Deadline"}
                    value={formData?.completedBeforeDeadline}
                />
            </Card>

            <SectionHeader
                title={"Client & Stakeholder Feedback"}
                icon={"chatbubbles"}
                iconColor={"#b300ff"}
            />
            <Card>
                <View style={styles.row}>
                    <Counter
                        width={"48%"}
                        onDecrese={() =>
                            onChange("clientPositiveFeedback", formData?.clientPositiveFeedback - 1)
                        }
                        onIncrease={() =>
                            onChange("clientPositiveFeedback", formData?.clientPositiveFeedback + 1)
                        }
                        label={"Positive Feedback"}
                        value={formData?.clientPositiveFeedback}
                    />
                    <Counter
                        width={"48%"}
                        onDecrese={() =>
                            onChange("clientNegativeFeedback", formData?.clientNegativeFeedback - 1)
                        }
                        onIncrease={() =>
                            onChange("clientNegativeFeedback", formData?.clientNegativeFeedback + 1)
                        }
                        label={"Negative Feedback"}
                        value={formData?.clientNegativeFeedback}
                    />
                </View>

                <View style={styles.row}>
                    <Counter
                        width={"48%"}
                        onDecrese={() =>
                            onChange("clientLost", formData?.clientLost - 1)
                        }
                        onIncrease={() =>
                            onChange("clientLost", formData?.clientLost + 1)
                        }
                        label={"Client Lost"}
                        value={formData?.clientLost}
                    />
                    <Counter
                        width={"48%"}
                        onDecrese={() =>
                            onChange("clientsOnboarded", formData?.clientsOnboarded - 1)
                        }
                        onIncrease={() =>
                            onChange("clientsOnboarded", formData?.clientsOnboarded + 1)
                        }
                        label={"Clients Onboarded"}
                        value={formData?.clientsOnboarded}
                    />
                </View>
            </Card>

            <SectionHeader
                title={"Performance Summary & Key Metrics"}
                icon={"analytics"}
                iconColor={"#30b600"}
            />

            <View style={styles.row}>
                <SummaryCard
                    header={"Task Completion Rate"}
                    icon={"information-circle-outline"}
                    value={taskRate}
                    footer={"Completed / Total assigned"}
                />
                <SummaryCard
                    header={"Deadline Performance"}
                    icon={"time"}
                    value={0}
                    footer={"On-time completion rate"}
                />
            </View>

        </View>
    );
};

const SummaryCard = ({ header, value, icon, footer }) => {
    return (
        <Card style={styles.card}>
            <View
                style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
            >
                <AppText style={{ width: "80%", fontSize: 15 }}>{header}</AppText>
                <Ionicons name={icon} size={24} color={colors.success} />
            </View>

            <AppText style={{ fontSize: 28, fontWeight: "700", color: "#ad00dc" }}>
                {value}%
            </AppText>
            <AppText style={{ fontSize: 14, color: colors.medium }}>{footer}</AppText>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "16",
    },
    card: {
        width: "48%",
        height: 200,
        justifyContent: "space-evenly",
        marginBottom: 0,
    },
});

export default TaskPerformance;
