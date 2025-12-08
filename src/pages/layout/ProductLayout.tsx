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

const ProductLayout = () => {

    return <MainLayout>
        <Header></Header>
        <main className="flex">
            <CategorySider />
            <div className="w-[80%]">
                <ProductNavigator></ProductNavigator>
                <Outlet />
            </div>
        </main>
    </MainLayout>
}

export default ProductLayout