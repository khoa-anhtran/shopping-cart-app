import { Outlet } from "react-router-dom"
import { lazy } from "react"
import MainLayout from "./MainLayout"

const Header = lazy(() => import('../layout/Header'))
const CategorySider = lazy(() => import('../pages/home/CategorySider'))
const Cart = lazy(() => import('../pages/cart/Cart'))
const ProductNavigator = lazy(() => import("../pages/products/components/ProductNavigator"))

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