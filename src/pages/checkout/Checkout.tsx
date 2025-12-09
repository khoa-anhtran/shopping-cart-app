import { useCallback } from "react";
import { Steps, Button } from "antd";
import ShippingAddress from "./components/ShippingAddress";
import PaymentDetails from "./components/PaymentDetails";
import OrderReview from "./components/OrderReview";
import CheckoutComplete from "./components/CheckoutComplete";
import { useSelector } from "react-redux";
import { useCart } from "@/contexts/CartContext";
import { formatVnd } from "@/utils/helpers";
import { selectCurrentStep, selectPaymentStatus, selectShippingAddress } from "./selectors";
import { useDispatch } from "react-redux";
import { nextStep, placeOrder, prevStep } from "./actions";
import { PAYMENT_STEP, PAYMENT_STEP_MAP } from "@/constants/payment";
import { selectCartEntities } from "../cart/selectors";

const Checkout = () => {
    const dispatch = useDispatch()

    const cartItemEntities = useSelector(selectCartEntities)
    const shippingAddress = useSelector(selectShippingAddress)
    const paymentStatus = useSelector(selectPaymentStatus)
    const currentStep = useSelector(selectCurrentStep)

    const { totalValues, selectedItems } = useCart()

    const onPlaceOrder = useCallback(() => {
        const items = selectedItems.map(id => cartItemEntities[id])

        dispatch(placeOrder({ items, paymentStatus, shippingAddress, total: totalValues, isSaved: shippingAddress.isSaved }))
    }, [selectedItems, cartItemEntities, paymentStatus, shippingAddress, totalValues, dispatch])

    const goPrev = useCallback(() => {
        dispatch(prevStep())
    }, [dispatch])

    const goNext = useCallback(() => {
        dispatch(nextStep())
    }, [dispatch])

    const mainSection = useCallback(() => {
        switch (currentStep) {
            case PAYMENT_STEP.FILL_SHIPPING_ADDRESS:
                return <ShippingAddress goPrev={goPrev} goNext={goNext} />

            case PAYMENT_STEP.CHOOSE_PAYMENT:
                return <PaymentDetails />

            case PAYMENT_STEP.REVIEW_ORDER:
                return <OrderReview />

            case PAYMENT_STEP.FINISH_ORDER:
                return <CheckoutComplete />

            default:
                return <></>
        }
    }, [currentStep, goPrev, goNext])

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

                <div className="space-y-4 px-4">
                    {selectedItems.map(itemId => (<div key={itemId} className="flex justify-between gap-4">
                        <div>
                            <dt className="font-medium">{cartItemEntities[itemId].title} <span>x{cartItemEntities[itemId].quantity}</span></dt>
                            <dd className="text-slate-400 text-xs">
                                {cartItemEntities[itemId].title}
                            </dd>
                        </div>
                        <span>{formatVnd(cartItemEntities[itemId].price)}</span>
                    </div>))}
                </div>
            </aside>

            {/* Right column: steps */}
            <section className="dark:bg-slate-900 px-4 py-6 lg:px-8 lg:py-8 flex-1">
                {/* Steps header */}
                <Steps
                    current={PAYMENT_STEP_MAP(currentStep)}
                    size="small"
                    className="mb-6 [&_.ant-steps-item-title]:text-xs lg:[&_.ant-steps-item-title]:text-sm"
                    items={[
                        { title: "Shipping address" },
                        { title: "Payment details" },
                        { title: "Review your order" },
                        { title: "Done" },
                    ]}
                >
                </Steps>

                {/* Content */}
                <div className="mt-6">
                    {mainSection()}
                </div>

                {/* Footer buttons */}
                {(currentStep !== PAYMENT_STEP.FILL_SHIPPING_ADDRESS && currentStep !== PAYMENT_STEP.FINISH_ORDER) && (
                    <div className="mt-8 flex justify-between">
                        <Button
                            type="link"
                            className="text-slate-300 px-0"
                            disabled={currentStep === PAYMENT_STEP.FILL_SHIPPING_ADDRESS}
                            onClick={goPrev}
                        >
                            Previous
                        </Button>

                        <Button type="primary" onClick={async () => {
                            if (currentStep === PAYMENT_STEP.REVIEW_ORDER)
                                onPlaceOrder()
                            else
                                goNext()
                        }}>
                            {currentStep === PAYMENT_STEP.REVIEW_ORDER ? "Place order" : "Next"}
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Checkout