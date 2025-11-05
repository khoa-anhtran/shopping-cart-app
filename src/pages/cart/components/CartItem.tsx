import { Product } from "@/pages/products/reducers";

type CartItemProps = {
    product: Product;
    quantity: number;
    onDecrease: (id: number, qty: number) => void;
    onIncrease: (id: number) => void;
    onSelectItem: (id: number) => void;
    onRemoveCartItem: (id: number) => void;
    isSelected: boolean
}

const CartItem = ({ product, onDecrease, onIncrease, onRemoveCartItem, quantity, onSelectItem, isSelected }: CartItemProps) => {
    return <article className="cart-item" role="article" aria-label={product.title}>
        <div className="cart-item__checkbox">
            <input type="checkbox" name="" id="" role="checkbox" aria-label="toggle select item" checked={isSelected} onChange={() => onSelectItem(product.id)} />
        </div>

        <div className="cart-item__media">
            <img src={product?.thumbnail} alt={product.title} />
        </div>

        <div className="cart-item__info">
            <h3 className="cart-item__title">{product.title}</h3>
            <div className="cart-item__price">
                {product?.price}<span className="currency"> $</span>
            </div>
        </div>

        <div className="cart-item__qty" aria-label="Quantity">
            <button
                className="btn"
                type="button"
                aria-label="Decrease quantity"
                data-testid="qty-dec"
                onClick={() => onDecrease(product.id, quantity)}
            >−</button>

            <div className="value" aria-live="polite" data-testid="qty-value">{quantity}</div>

            <button
                className="btn"
                type="button"
                aria-label="Increase quantity"
                data-testid="qty-inc"
                onClick={() => onIncrease(product.id)}
            >+</button>
        </div>

        <button
            className="cart-item__remove"
            type="button"
            aria-label="Remove Item"
            onClick={() => onRemoveCartItem(product.id)}
        >✕</button>
    </article>
}

export default CartItem