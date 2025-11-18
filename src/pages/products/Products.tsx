import { useDispatch } from "react-redux"
import { useCallback } from "react"
import ProductGrid from "./components/ProductGrid"
import { itemAdded } from "../cart/actions"
import { useProducts } from "@/hooks/useProducts"
import useUserInfo from "@/hooks/useUserInfo"
import Segmented from "antd/es/segmented"
import { productsFiltered } from "./actions"

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

    if (!isLoading)
        return <section className="dark:bg-black dark:text-white">
            <div className="w-full row-center py-8">
                <Segmented<string>
                    className="shadow-2xl"
                    size="large"
                    options={data}
                    onChange={onChangeCategory}
                    shape="round"
                />
            </div>

            <ProductGrid products={products} onAddToCart={onAddToCart} />
        </section>

}

export default Products