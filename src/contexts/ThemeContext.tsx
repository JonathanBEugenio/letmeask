import { createContext, ReactNode, useEffect, useState } from "react";

type Theme = 'light' | 'dark';

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
}

type ThemeContextProviderProps = {
    children: ReactNode;
}

export const themeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeContextProviderProps) {
    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        const storagedTheme = localStorage.getItem('theme');

        return (storagedTheme ?? 'light') as Theme;
    });

    useEffect(() => {
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme]);

    function toggleTheme() {
        console.log('aqui')
        setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
    }

    return (
        <themeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
            {props.children}
        </themeContext.Provider>
    )
}