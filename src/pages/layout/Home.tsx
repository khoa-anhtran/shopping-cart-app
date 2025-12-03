import ProductDetailsModal from "../products/components/ProductDetailsModal"
import { lazy } from "react"

const Products = lazy(() => import('../products/Products'))
const Cart = lazy(() => import('../cart/Cart'))

const Home = () => {

    return <>
        <Products />
        <ProductDetailsModal />
        <Cart />
    </>
}

export default Home