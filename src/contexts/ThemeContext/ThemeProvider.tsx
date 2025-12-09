import { THEME } from "@/constants/ui";
import ThemeContext from "@/contexts/ThemeContext/ThemeContext";
import { ReactNode, useCallback, useEffect, useState } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {

    const [theme, setTheme] = useState<string>(() => {
        if (typeof window === "undefined") return THEME.LIGHT;

        const stored = localStorage.getItem("theme");
        if (stored === THEME.LIGHT || stored === THEME.DARK) return stored;

        // const prefersDark = window.matchMedia?.(
        //     "(prefers-color-scheme: dark)"
        // ).matches;

        return THEME.LIGHT;
    });


    useEffect(() => {
        const root = document.documentElement;
        if (theme === THEME.DARK) {
            root.classList.add("dark");
            localStorage.setItem("theme", THEME.DARK);
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", THEME.LIGHT);
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === THEME.DARK ? THEME.LIGHT : THEME.DARK));
    }, []);

    return (
        <ThemeContext value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext>
    );

};

export default ThemeProvider