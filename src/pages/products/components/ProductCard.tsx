import { Product } from "../reducers";

export default function ProductCard({ product, onAddToCart }: { product: Product, onAddToCart: () => void }) {
    return <article className="product-card" role="article" aria-label={product.title}>
        <div className="product-card__media">
            <img src={product.thumbnail} alt={product.title} role="image" />
        </div>
        <div className="product-card__body">
            <h3 className="product-card__title">{product.title}</h3>
            <div className="product-card__price">
                {product.price}<span className="currency"> $</span>
            </div>
        </div>
        <button className="product-card__actions" onClick={onAddToCart}>Add to cart</button>
    </article>
}