import { useDispatch } from "react-redux"
import { useCallback, useEffect } from "react"
import ProductGrid from "./components/ProductGrid"
import { itemAdded } from "../cart/actions"
import { useProducts } from "@/hooks/useProducts"
import useUserInfo from "@/hooks/useUserInfo"
import { fetchMoreProductsRequested, productsFiltered } from "./actions"
import { showPDsModal } from "../layout/ui/uiActions"
import { fetchCommentsRequested } from "../comments/actions"
import { Segmented } from "antd"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectProductPageInfo } from "./selectors"

function useScrollToBottom(onBottom: () => void) {
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const viewportHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            const isBottom =
                scrollTop + viewportHeight >= fullHeight - 5;

            if (isBottom) {
                onBottom();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [onBottom]);
}

const Products = () => {
    const dispatch = useDispatch()
    const { products, isLoading } = useProducts()
    const navigate = useNavigate()

    const pageInfo = useSelector(selectProductPageInfo)

    const onAddToCart = useCallback((productId: string) => {
        dispatch(itemAdded(productId))
    }, [dispatch])

    const onChangeCategory = useCallback((value: string) => {
        dispatch(productsFiltered(value))
    }, [dispatch])

    const onClickProduct = useCallback((productId: string) => {
        navigate(`/products/${productId}`)
        dispatch(fetchCommentsRequested(productId))

    }, [dispatch])

    useScrollToBottom(() => {
        if (pageInfo && !isLoading && pageInfo.hasNextPage)
            dispatch(fetchMoreProductsRequested(pageInfo.endCursor))
    });

    if (!isLoading)
        return <section className="dark:bg-black dark:text-white">
            <ProductGrid products={products} onAddToCart={onAddToCart} onClick={onClickProduct} />
        </section>

}

export default Products