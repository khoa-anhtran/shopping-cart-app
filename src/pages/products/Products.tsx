import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import ProductGrid from "./components/ProductGrid"
import { itemAdded } from "../cart/actions"
import { selectProducts, selectProductsError, selectProductsStatus } from "./selectors"
import { fetchProductsRequested } from "./actions"
import {  notification } from "antd";

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

        if (status === "failed")
            notification.error({
                message: error,
            });
    }, [status])

    const onAddToCart = (productId: number) => {
        dispatch(itemAdded(productId))
        notification.success({
            message: 'Your product have added',
        });
    }


    if (status === 'succeeded') {
        content = <ProductGrid products={products} onAddToCart={onAddToCart} />
    }

    if (status === 'failed')
        content = <div>{error}</div>

    return <section className="product-section">{content}</section>

}

export default Products