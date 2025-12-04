import { useDispatch } from "react-redux"
import { useCallback } from "react"
import ProductGrid from "./components/ProductGrid"
import { itemAdded } from "../cart/actions"
import { useProducts } from "@/hooks/useProducts"
import useUserInfo from "@/hooks/useUserInfo"
import { productsFiltered } from "./actions"
import { showPDsModal } from "../layout/ui/uiActions"
import { fetchCommentsRequested } from "../comments/actions"
import { Segmented } from "antd"
import { useNavigate } from "react-router-dom"

const data = ['All', 'Beauty & Makeup', 'Fragrances', 'Furniture', 'Groceries', 'Pet Supplies']

const Products = () => {
    const dispatch = useDispatch()
    const { products, isLoading } = useProducts()
    const navigate = useNavigate()

    const onAddToCart = useCallback((productId: string) => {
        dispatch(itemAdded(productId))
    }, [dispatch])

    const onChangeCategory = useCallback((value: string) => {
        dispatch(productsFiltered(value))
    }, [dispatch])

    const onOpenPDsModal = useCallback((productId: string) => {
        navigate(`/products/${productId}`)
        // dispatch(showPDsModal(productId))
        dispatch(fetchCommentsRequested(productId))

    }, [dispatch])

    if (!isLoading)
        return <section className="dark:bg-black dark:text-white">
            <ProductGrid products={products} onAddToCart={onAddToCart} onOpenPDsModal={onOpenPDsModal} />
        </section>

}

export default Products