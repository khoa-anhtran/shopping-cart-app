import { Outlet, useLocation } from "react-router-dom"
import useTheme from "@/hooks/useTheme"
import { App as AntdApp, Breadcrumb, ConfigProvider } from 'antd'
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./ErrorFallback"
import { lazy } from "react"
import CartProvider from "@/providers/CartProvider"
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import ProductNavigator from "../products/components/ProductNavigator"
import CategorySider from "./CategorySider"
import MediaViewer from "../product-details/component/MediaViewer"
import MainLayout from "./MainLayout"

const Header = lazy(() => import('../layout/Header'))

const CheckoutLayout = () => {

    return <MainLayout>
        <Header></Header>
        <main className="flex">
            <div className="w-full">
                <Outlet />
            </div>
        </main>
    </MainLayout>
}

export default CheckoutLayout