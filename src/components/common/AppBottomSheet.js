import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import AppText from './AppText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../../constants/colors'

const AppBottomSheet = ({ visible, listItem, onSelect, onCancel }) => {

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["60%"], []);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.dismiss();
        }
    }, [visible]);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                opacity={0.5}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
            />
        ),
        []
    );

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            onDismiss={onCancel}
        >
            <BottomSheetScrollView
                style={[styles.modal, { marginBottom: insets.bottom }]}
            >
                {
                    listItem?.map((item, id) => (
                        <View key={id}>
                            <TouchableOpacity onPress={() => {
                                onSelect(item);
                                onCancel();
                            }} style={{ paddingVertical: 12 }}>
                                <AppText>{item.label}</AppText>
                            </TouchableOpacity>
                            <View style={{ width: "100%", height: 1, backgroundColor: colors.light }} />
                        </View>
                    ))
                }

                <View style={{ height: 50 }} />

            </BottomSheetScrollView>
        </BottomSheetModal>
    )
}

const styles = StyleSheet.create({
    modal: {
        padding: 24,
    },
})
export default AppBottomSheet