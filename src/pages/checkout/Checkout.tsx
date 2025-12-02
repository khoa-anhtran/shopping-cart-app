import React, { useState } from "react";
import { Steps, Tabs, Input, Checkbox, Button } from "antd";
import ShippingAddress from "./components/ShippingAddress";
import PaymentDetails from "./components/PaymentDetails";
import OrderReview from "./components/OrderReview";
import CheckoutComplete from "./components/CheckoutComplete";

const { Step } = Steps;
const { TabPane } = Tabs;

const Checkout = () => {
    const [current, setCurrent] = useState(0);

    const goNext = () => setCurrent((c) => Math.min(c + 1, 3));
    const goPrev = () => setCurrent((c) => Math.max(c - 1, 0));

    const isReview = current === 2;
    const isCompleted = current === 3;

    return (
        <div className="h-[95vh] flex py-4 px-4 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors">
            {/* Left column: order summary */}
            <aside className="dark:bg-slate-900 border-r border-gray-300 h-full px-4 py-6 lg:px-8 lg:py-8 w-2/7">
                <h2 className="text-2xl font-medium text-sky-400 mb-4 uppercase">
                    Order summary
                </h2>

                <div className="flex flex-col justify-between items-baseline mb-6">
                    <span className="text-sm text-slate-400">Total</span>
                    <span className="text-2xl font-semibold">$144.97</span>
                </div>

                <dl className="space-y-4 px-4">
                    <div className="flex justify-between">
                        <div>
                            <dt className="font-medium">Professional plan</dt>
                            <dd className="text-slate-400 text-xs">
                                Monthly subscription
                            </dd>
                        </div>
                        <span>$15.00</span>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <dt className="font-medium">Dedicated support</dt>
                            <dd className="text-slate-400 text-xs">
                                Included in the Professional plan
                            </dd>
                        </div>
                        <span>Free</span>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <dt className="font-medium">Hardware</dt>
                            <dd className="text-slate-400 text-xs">
                                Devices needed for development
                            </dd>
                        </div>
                        <span>$69.99</span>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <dt className="font-medium">Landing page template</dt>
                            <dd className="text-slate-400 text-xs">License</dd>
                        </div>
                        <span>$49.99</span>
                    </div>
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
                        <ShippingAddress />
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
                {!isCompleted && (
                    <div className="mt-8 flex justify-between">
                        <Button
                            type="link"
                            className="text-slate-300 px-0"
                            disabled={current === 0}
                            onClick={goPrev}
                        >
                            Previous
                        </Button>

                        <Button type="primary" onClick={goNext}>
                            {isReview ? "Place order" : "Next"}
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Checkout