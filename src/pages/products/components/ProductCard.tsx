import { ImageWithPreview } from "@/components/ImageWithPreview";
import { Product } from "@/types/product";
import { formatVnd } from "@/utils/helpers";

type ProductCardProps = {
    product: Product,
    onAddToCart: () => void,
    onOpenPDsModal: () => void,
}

export default function ProductCard({ product, onAddToCart, onOpenPDsModal }: ProductCardProps) {

    return <article
        className="rounded-xl shadow-xl flex flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-2xl justify-between dark:bg-gray-900"
        role="article"
        aria-label={product.title}
        onClick={onOpenPDsModal}
    >
        <ImageWithPreview src={product.thumbnail} alt={product.title} className="min-h-60" size="lg" />

        <div className="px-4 py-2 space-y-4">
            <h3 className="font-semibold md:text-xl">{product.title}</h3>
            <div className="md:text-xl font-bold">
                {formatVnd(product.price)}
            </div>
        </div>

        <button
            className="py-4 bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-800 hover:bg-gray-300 cursor-pointer active:bg-gray-500"
            onClick={(e) => {
                e.stopPropagation()
                onAddToCart()
            }}
        >
            Add to cart
        </button>
    </article>
}