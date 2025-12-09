import { App as AntdApp, ConfigProvider } from 'antd'
import { ErrorBoundary } from "react-error-boundary"
import { ErrorFallback } from "@/pages/error"
import { ReactNode } from "react"
import { CartProvider } from "@/contexts/CartContext"
import { MediaViewer } from '@/pages/product-details'

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