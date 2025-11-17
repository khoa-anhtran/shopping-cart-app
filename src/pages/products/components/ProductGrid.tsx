import { Product } from "../reducers";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onAddToCart }: { products: Record<number, Product>, onAddToCart: (productId: number) => void }) {

    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4 px-8">
        {Object.keys(products).map((productId: string) =>
            <ProductCard
                product={products[Number(productId)] as Product}
                key={productId}
                onAddToCart={() => onAddToCart(Number(productId))}
            />)}
    </div>
}