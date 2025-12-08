import { App as AntdApp, ConfigProvider } from 'antd'
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./ErrorFallback"
import { ReactNode } from "react"
import CartProvider from "@/providers/CartProvider"
import MediaViewer from "../product-details/component/MediaViewer"

const MainLayout = ({ children }: { children: ReactNode }) => {
    return <ConfigProvider>
        <AntdApp>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <CartProvider>
                    <div className="min-h-screen">
                        {children}
                    </div>
                    <MediaViewer />
                </CartProvider>
            </ErrorBoundary>
        </AntdApp>
    </ConfigProvider >
}

export default MainLayout