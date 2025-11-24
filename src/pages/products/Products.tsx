import { useDispatch } from "react-redux"
import { useCallback } from "react"
import ProductGrid from "./components/ProductGrid"
import { itemAdded } from "../cart/actions"
import { useProducts } from "@/hooks/useProducts"
import useUserInfo from "@/hooks/useUserInfo"
import { fetchProductsRequested, productsFiltered } from "./actions"
import { showPDsModal } from "../layout/ui/uiActions"
import { fetchComments } from "@/services/commentService"
import { fetchCommentsRequested } from "../comments/actions"
import { Segmented } from "antd"

const data = ['All', 'Beauty & Makeup', 'Fragrances', 'Furniture', 'Groceries', 'Pet Supplies']

const Products = () => {
    const dispatch = useDispatch()
    const { products, isLoading } = useProducts()
    const { userId } = useUserInfo()

    const onAddToCart = useCallback((productId: string) => {
        dispatch(itemAdded(productId, userId!))
    }, [dispatch, userId])

    const onChangeCategory = useCallback((value: string) => {
        dispatch(productsFiltered(value))
    }, [])

    const onOpenPDsModal = useCallback((productId: string) => {
        dispatch(showPDsModal(productId))
        dispatch(fetchCommentsRequested(productId))
    }, [])

    if (!isLoading)
        return <section className="dark:bg-black dark:text-white">
            <div className="w-full row-center py-8">
                <Segmented
                    className="shadow-2xl max-w-[80vw] overflow-x-scroll md:overflow-hidden"
                    size="large"
                    options={data}
                    onChange={onChangeCategory}
                    shape="round"
                />
            </div>

            <ProductGrid products={products} onAddToCart={onAddToCart} onOpenPDsModal={onOpenPDsModal} />
        </section>

}

export default Products