import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

type ProductGridProps = {
    products: Record<string, Product>,
    onAddToCart: (productId: string) => void,
    onOpenPDsModal: (productId: string) => void,
}

export default function ProductGrid({ products, onAddToCart, onOpenPDsModal }: ProductGridProps) {

    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4 px-8">
        {Object.keys(products).map((productId: string) =>
            <ProductCard
                product={products[productId] as Product}
                key={productId}
                onAddToCart={() => onAddToCart(productId)}
                onOpenPDsModal={() => onOpenPDsModal(productId)}
            />)}
    </div>
}