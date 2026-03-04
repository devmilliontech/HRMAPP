import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";


const AppSlider = ({ value = 0, editable = true, onChange, color, minVal, maxVal }) => {
    const progress = useSharedValue(value);
    const min = useSharedValue(minVal);
    const max = useSharedValue(maxVal);

    return (
        <View style={styles.container}>
            <Slider
                progress={progress}
                minimumValue={min}
                maximumValue={max}
                disable={!editable}
                bubble={(v) => v.toFixed(0)}
                onSlidingComplete={(v) => {
                    console.log(v)
                    onChange(v.toFixed(0));
                }}
                theme={{
                    minimumTrackTintColor: color,
                    maximumTrackTintColor: "#E5E7EB",
                    cacheTrackTintColor: '#333',
                    bubbleBackgroundColor: '#666',
                    heartbeatColor: '#999',
                }}
                style={styles.slider}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    slider: {
        height: 10,
    },
});


export default AppSlider;
