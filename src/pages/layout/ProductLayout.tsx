import { Outlet, useLocation } from "react-router-dom"
import useTheme from "@/hooks/useTheme"
import { App as AntdApp, Breadcrumb, ConfigProvider } from 'antd'
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./ErrorFallback"
import { lazy, Suspense } from "react"
import CartProvider from "@/providers/CartProvider"
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import MediaViewer from "../product-details/component/MediaViewer"
import MainLayout from "./MainLayout"
import CategorySiderSkeleton from "./CategorySiderSkeleton"

const Header = lazy(() => import('../layout/Header'))
const CategorySider = lazy(() => import('../layout/CategorySider'))
const Cart = lazy(() => import('../cart/Cart'))
const ProductNavigator = lazy(() => import("../products/components/ProductNavigator"))

const ProductLayout = () => {

    return <MainLayout>
        <Header></Header>
        <main className="flex">
            <CategorySider />
            <div className="lg:w-[80%] w-full">
                <ProductNavigator />
                <Outlet />
            </div>
        </main>
        <Cart />
    </MainLayout>
}

export default ProductLayout