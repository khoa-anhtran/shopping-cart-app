import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import ProductGrid from "./components/ProductGrid"
import { itemAdded } from "../cart/actions"
import { selectProducts, selectProductsError, selectProductsStatus } from "./selectors"
import { fetchProductsRequested } from "./actions"
import { toast } from "react-toast"
import { Modal, Button, message, notification } from "antd";

const Products = () => {
    const dispatch = useDispatch()
    const status = useSelector(selectProductsStatus)
    const error = useSelector(selectProductsError)
    const products = useSelector(selectProducts)

    let content

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProductsRequested())
        }
    }, [status])

    useEffect(() => {
        if (error)
            notification.error({
                message: error,
                placement: 'topRight',
            });
    }, [error])

    const onAddToCart = (productId: number) => {
        dispatch(itemAdded(productId))
        notification.success({
            message: 'Your product have added',
            placement: 'topRight',
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