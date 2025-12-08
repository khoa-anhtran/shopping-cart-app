import { Outlet } from "react-router-dom"
import { lazy } from "react"
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