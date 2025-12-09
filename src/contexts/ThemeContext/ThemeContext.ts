import { createContext } from "react";

export type ThemCtx = { theme: string, toggleTheme: () => void }

const ThemeContext = createContext<ThemCtx | undefined>(undefined);

export default ThemeContext
