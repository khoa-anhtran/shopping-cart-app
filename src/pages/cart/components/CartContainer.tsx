import { useCart } from "@/contexts/CartContext";
import CartActions from "./CartActions"
import CartHeader from "./CartHeader"
import { useSelector } from "react-redux"
import CartList from "./CartList"
import { selectCartStatus } from "../selectors"
import { STATUS } from "@/constants/api"
import CartFooter from "./CartFooter"
import { Empty } from "antd"

const CartContainer = () => {
    const { selectedItems, onRemoveCartItems, onClickCloseCart, totalQty, cartItems } = useCart()
    const status = useSelector(selectCartStatus)

    const isLoading = status !== STATUS.SUCCESS

    const hasSelectedItem = selectedItems.length !== 0

    let content

    if (!isLoading) {

        if (cartItems.length === 0)
            content = <div className="h-[70vh] row-center">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        else
            content = <CartList />
    }

    return <>
        <div className="cart-modal__overlay"></div>

        <aside
            className="cart-modal__panel border-l rounded-tl-xl rounded-bl-xl absolute top-0 right-0 h-full flex flex-col w-full md:w-[70%] lg:w-[50%]
            dark:bg-gray-800 bg-white dark:text-white"
            onClick={(e) => {
                e.stopPropagation()
            }}>

            <CartHeader onClickCloseCart={onClickCloseCart} totalQty={totalQty} />

            <div className="overflow-auto p-5 bg-gray-100 h-[90%] dark:bg-gray-800">
                <CartActions
                    isCartEmpty={cartItems.length === 0}
                    hasSelectedItem={hasSelectedItem}
                    onRemoveCartItems={() => onRemoveCartItems(selectedItems)}
                />
                {content}
            </div>

            <CartFooter hasSelectedItem={hasSelectedItem}></CartFooter>
        </aside>
    </>
}

export default CartContainer