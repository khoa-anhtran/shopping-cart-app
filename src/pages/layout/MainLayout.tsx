import { Outlet } from "react-router-dom"
import useTheme from "@/hooks/useTheme"
import { App as AntdApp, ConfigProvider } from 'antd'
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./ErrorFallback"
import { lazy } from "react"
import CartProvider from "@/providers/CartProvider"

const Header = lazy(() => import('../layout/Header'))

const MainLayout = () => {
    const { theme } = useTheme()

    return <ConfigProvider theme={{
        components: {
            Segmented: {
                itemSelectedBg: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.1)",
                itemSelectedColor: theme === "dark" ? "rgba(255,255,255,1)" : "rgba(0,0,0,0.88)",
                trackBg: theme === "dark" ? "rgba(255,255,255,0.1)" : "#f5f5f5",
                itemColor: theme === "dark" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.65)",
                itemHoverBg: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.06)",
                itemHoverColor: theme === "dark" ? "rgba(255,255,255,1)" : "rgba(0,0,0,0.88)",
            }
        }
    }}>
        <AntdApp>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <div className="min-h-screen">
                    <CartProvider>
                        <Header></Header>
                        <Outlet />
                    </CartProvider>
                </div>
            </ErrorBoundary>
        </AntdApp>
    </ConfigProvider >
}

export default MainLayout