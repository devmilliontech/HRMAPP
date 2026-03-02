import { DefaultTheme } from "@react-navigation/native"
import { colors } from "../constants/colors"

export const myTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        background: "white"
    }
}