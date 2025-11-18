import { useDispatch } from "react-redux"
import { useCallback } from "react"
import ProductGrid from "./components/ProductGrid"
import { itemAdded } from "../cart/actions"
import { useProducts } from "@/hooks/useProducts"
import useUserInfo from "@/hooks/useUserInfo"

const Products = () => {
    const dispatch = useDispatch()
    const { products, isLoading } = useProducts()
    const { userId } = useUserInfo()

    const onAddToCart = useCallback((productId: string) => {
        dispatch(itemAdded(productId, userId!))
    }, [dispatch, userId])

    if (!isLoading)
        return <section className="dark:bg-black dark:text-white">
            <ProductGrid products={products} onAddToCart={onAddToCart} />
        </section>

}

export default Products