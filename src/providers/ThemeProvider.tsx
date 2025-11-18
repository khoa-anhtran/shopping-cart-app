import ThemeContext, { Theme } from "@/contexts/ThemeContext";
import { ReactNode, useCallback, useEffect, useState } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {

    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") return "light";

        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored === "light" || stored === "dark") return stored;

        const prefersDark = window.matchMedia?.(
            "(prefers-color-scheme: dark)"
        ).matches;

        return prefersDark ? "dark" : "light";
    });


    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    return (
        <ThemeContext value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext>
    );

};

export default ThemeProvider