import { useDispatch, useSelector } from "react-redux"
import { useCallback, useEffect, useRef, useState } from "react"
import ProductGrid from "./components/ProductGrid"
import { itemAdded } from "../cart/actions"
import { selectProducts, selectProductsError, selectProductsStatus } from "./selectors"
import { fetchProductsRequested } from "./actions"
import { notification } from "antd";
import SimpleErrorPage from "../layout/SimpleErrorPage"
import LoadingSpinner from "@/components/LoadingSpinner"
import { notify } from "@/utils/helpers"

const Products = () => {
    const dispatch = useDispatch()
    const status = useSelector(selectProductsStatus)
    const error = useSelector(selectProductsError)
    const products = useSelector(selectProducts)

    const isFetching = useRef(false)

    let content

    useEffect(() => {
        if (status === 'idle' && !isFetching.current) {
            dispatch(fetchProductsRequested())
            isFetching.current = true
        }
        notify({ status, error, message: "Fetch products successfully" })
    }, [status])

    const onAddToCart = useCallback((productId: number) => {
        dispatch(itemAdded(productId))
        notify({ status: "succeeded", error, message: 'Your product have added' })
    }, [dispatch])

    const onRetry = useCallback(() => {
        dispatch(fetchProductsRequested())
    }, [dispatch])


    if (status === 'succeeded')
        content = <ProductGrid products={products} onAddToCart={onAddToCart} />

    if (status === 'failed')
        content = <SimpleErrorPage message={error ?? ""} onRetry={onRetry}></SimpleErrorPage >

    if (status === "loading")
        content = <LoadingSpinner overlay label="Loading page" size={"lg"} />

    return <section className="product-section">{content}</section>
}

export default Products