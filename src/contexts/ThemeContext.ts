import { createContext } from "react";

export type Theme = "light" | "dark"

const ThemeContext = createContext<{ theme: Theme, toggleTheme: () => void }>({ theme: "light", toggleTheme: () => { } });

export default ThemeContext
