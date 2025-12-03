import { useCallback, useState } from "react";
import { Steps, Button } from "antd";
import ShippingAddress from "./components/ShippingAddress";
import PaymentDetails from "./components/PaymentDetails";
import OrderReview from "./components/OrderReview";
import CheckoutComplete from "./components/CheckoutComplete";
import { useSelector } from "react-redux";
import useCart from "@/hooks/useCart";
import { formatVnd } from "@/utils/helpers";
import { selectProducts } from "../products/selectors";
import { selectCart } from "../cart/selectors";
import { selectPaymentInfo, selectShippingAddress } from "./selectors";
import { useDispatch } from "react-redux";
import { placeOrder } from "./actions";

const { Step } = Steps;

const Checkout = () => {
    const [current, setCurrent] = useState(0);

    const dispatch = useDispatch()

    const products = useSelector(selectProducts)
    const items = useSelector(selectCart)

    const shippingAddress = useSelector(selectShippingAddress)
    const paymentInfo = useSelector(selectPaymentInfo)

    const { totalValues, selectedItems } = useCart()

    const goNext = () => setCurrent((c) => Math.min(c + 1, 3));
    const goPrev = () => setCurrent((c) => Math.max(c - 1, 0));

    const isReview = current === 2;
    const isCompleted = current === 3;

    const onPlaceOrder = useCallback(() => {
        dispatch(placeOrder({ items, paymentInfo, shippingAddress, total: totalValues, isSaved: shippingAddress.isSaved }))
    }, [items, paymentInfo, shippingAddress, totalValues, dispatch])

    return (
        <div className="h-[95vh] flex py-4 px-4 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors">
            {/* Left column: order summary */}
            <aside className="dark:bg-slate-900 border-r border-gray-300 h-full px-4 py-6 lg:px-8 lg:py-8 w-2/7">
                <h2 className="text-2xl font-medium text-sky-400 mb-4 uppercase">
                    Order summary
                </h2>

                <div className="flex flex-col justify-between items-baseline mb-6">
                    <span className="text-sm text-slate-400">Total</span>
                    <span className="text-2xl font-semibold">{formatVnd(totalValues)}</span>
                </div>

                <dl className="space-y-4 px-4">
                    {selectedItems.map(itemId => (<div className="flex justify-between">
                        <div>
                            <dt className="font-medium">{products[itemId].title} <span>x{items.find(item => item.itemId === itemId)?.quantity}</span></dt>
                            <dd className="text-slate-400 text-xs">
                                {products[itemId].title}
                            </dd>
                        </div>
                        <span>{formatVnd(products[itemId].price)}</span>
                    </div>))}
                </dl>
            </aside>

            {/* Right column: steps */}
            <section className="dark:bg-slate-900 px-4 py-6 lg:px-8 lg:py-8 flex-1">
                {/* Steps header */}
                <Steps
                    current={current}
                    size="small"
                    className="mb-6 [&_.ant-steps-item-title]:text-xs lg:[&_.ant-steps-item-title]:text-sm"
                >
                    <Step title="Shipping address" />
                    <Step title="Payment details" />
                    <Step title="Review your order" />
                    <Step title="Done" />
                </Steps>

                {/* Content */}
                <div className="mt-6">
                    {current === 0 && (
                        <ShippingAddress goNext={goNext} goPrev={goPrev} current={current} />
                    )}

                    {current === 1 && (
                        <PaymentDetails />
                    )}

                    {isReview && (
                        <OrderReview />
                    )}

                    {isCompleted && (
                        <CheckoutComplete />
                    )}
                </div>

                {/* Footer buttons */}
                {![0, 3].includes(current) && (
                    <div className="mt-8 flex justify-between">
                        <Button
                            type="link"
                            className="text-slate-300 px-0"
                            disabled={current === 0}
                            onClick={goPrev}
                        >
                            Previous
                        </Button>

                        <Button type="primary" onClick={async () => {
                            if (current === 2)
                                onPlaceOrder()
                            else
                                goNext()
                        }}>
                            {isReview ? "Place order" : "Next"}
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Checkout