import { View, Text, Modal, StyleSheet } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import LottieView from "lottie-react-native";
import { colors } from "../constants/colors";
import AppText from "../components/common/AppText";

const UploadScreen = ({ onDone, progress = 0, visible }) => {
    return (
        <Modal visible={visible}>
            <View style={styles.container}>
                {progress < 1 ? (
                    <>
                        <Progress.Bar color={colors.primary} progress={progress} width={200} />
                        <AppText style={styles.text}>{progress * 100}%</AppText>
                    </>
                ) : (
                    <LottieView
                        onAnimationFinish={onDone}
                        source={require("../../assets/animation/done.json")}
                        autoPlay
                        loop
                        style={styles.animation}
                    />
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    animation: {
        flex: 1,
        width: 150,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontWeight: 700,
        color: colors.primary,
    },
});

export default UploadScreen;
