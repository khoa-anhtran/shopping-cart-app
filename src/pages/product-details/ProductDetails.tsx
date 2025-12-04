import { ImageWithPreview } from "@/components/ImageWithPreview"
import { formatVnd } from "@/utils/helpers"
import { Button } from "antd"
import { useSelector } from "react-redux"
import { selectProducts } from "../products/selectors"
import { useParams } from "react-router-dom"
import { useProducts } from "@/hooks/useProducts"

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();

    const { products, isLoading } = useProducts()

    if (!id)
        throw new Error("No product id is existed")

    const product = products[id]

    return <main className="py-4 px-8 flex gap-4">
        <section className="w-[70%] space-y-4 px-4 py-2 bg-white rounded-md shadow">
            <div className="row-center">
                <ImageWithPreview
                    className="h-60 w-1/2"
                    src={product.thumbnail}
                />
            </div>

            <div>
                <h3 className="font-bold text-xl">
                    Relevant Products
                </h3>
                <div>

                </div>
            </div>

            <div>
                <h3 className="font-bold text-xl">
                    Rating and Reviews
                </h3>

                <div>
                    Rating board
                </div>

                <div>
                    Review list
                </div>
            </div>
        </section>
        <section className="w-[30%] rounded-md shadow space-y-4 px-4 py-2 bg-white sticky h-fit">
            <div className="font-bold text-xl">
                {product.title}
            </div>
            <div className="font-bold">
                {formatVnd(product.price)}
            </div>

            <Button type="primary" size="large">
                Add to cart
            </Button>
        </section>
    </main>
}

export default ProductDetails