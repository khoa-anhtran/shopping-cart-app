import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { cartToggled } from "../cart/actions"
import { selectCart } from "../cart/selectors"
import { userLogouted } from "../auth/actions"
import { selectAuth } from "../auth/selectors"
import { notification } from "antd"

const Header = () => {
    const dispatch = useDispatch()
    const { userId, email } = useSelector(selectAuth)
    const cartItems = useSelector(selectCart)

    const totalQuantity = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            return sum + item.quantity
        }, 0)
    }, [cartItems])

    const onClick = useCallback(() => {
        dispatch(cartToggled())
    }, [dispatch])

    const onLogout = useCallback(() => {
        dispatch(userLogouted())
        notification.success({
            message: "",
            description: "Logout successfully"
        })
    }, [dispatch])

    return <header className="app-header">
        <div className="nav">
            <div className="brand">Redux Shopping Cart</div>
            <div className="user">
                <h5 className="user-name" role="heading" aria-level={2}>
                    Logged in as {email}
                </h5>
                <button className="logout-btn" onClick={onLogout}>
                    Logout
                </button>
            </div>
            <div className="cart">
                <button className="cart-btn" onClick={onClick} aria-label="cart button">
                    <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24" transform="" id="injected-svg">
                        <path d="M10.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M8.82 15.77c.31.75 1.04 1.23 1.85 1.23h6.18c.79 0 1.51-.47 1.83-1.2l3.24-7.4c.14-.31.11-.67-.08-.95S21.34 7 21 7H7.33L5.92 3.62C5.76 3.25 5.4 3 5 3H2v2h2.33zM19.47 9l-2.62 6h-6.18l-2.5-6z" />
                    </svg></button>
                <span className="cart-badge"
                    role="status"
                    aria-live="polite"
                    aria-label="total quantity">{totalQuantity}</span>
            </div>
        </div>
    </header>
}

export default Header