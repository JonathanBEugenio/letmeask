import { useContext } from "react";
import { themeContext } from "../contexts/ThemeContext";

export function useTheme() {
    const value = useContext(themeContext);

    return value;
}