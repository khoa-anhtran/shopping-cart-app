const OrderReview = () => {
    return <div className="space-y-5">
        <h3 className="text-base lg:text-lg font-semibold">
            Review your order
        </h3>

        <div className="flex justify-between text-sm">
            <div>
                <p className="font-medium">Products</p>
                <p className="text-slate-400 text-xs">4 selected</p>
            </div>
            <span>$134.98</span>
        </div>

        <div className="flex justify-between text-sm">
            <div>
                <p className="font-medium">Shipping</p>
                <p className="text-slate-400 text-xs">Plus taxes</p>
            </div>
            <span>$9.99</span>
        </div>

        <div className="flex justify-between border-t border-slate-800 pt-4 mt-2 text-sm">
            <p className="font-medium">Total</p>
            <span className="font-semibold">$144.97</span>
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-3 text-sm">
            <h4 className="font-semibold text-sm">
                Shipment details
            </h4>
            <p>John Smith</p>
            <p className="text-slate-400 text-xs">
                1 MUI Drive, Reactville, Anytown, 99999, USA
            </p>
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-2 text-sm">
            <h4 className="font-semibold text-sm">Payment details</h4>
            <p>Card type: Visa</p>
            <p>Card holder: Mr. John Smith</p>
            <p>Card number: xxxx-xxxx-xxxx-1234</p>
            <p>Expiry date: 04/2024</p>
        </div>
    </div>
}

export default OrderReview