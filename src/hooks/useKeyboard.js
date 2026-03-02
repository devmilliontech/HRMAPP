import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export const useKeyboard = () => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height);
            setIsOpen(true);
        });

        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
            setIsOpen(false);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    return { keyboardHeight, isOpen };
};
