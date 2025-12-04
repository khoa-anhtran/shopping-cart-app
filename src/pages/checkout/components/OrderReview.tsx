import useCart from "@/hooks/useCart"
import { formatVnd } from "@/utils/helpers"
import { useSelector } from "react-redux"
import { selectPaymentStatus, selectShippingAddress } from "../selectors"

const OrderReview = () => {
    const { totalQty, totalValues } = useCart()
    const shippingAddress = useSelector(selectShippingAddress)
    const paymentStatus = useSelector(selectPaymentStatus)

    return <div className="space-y-5">
        <h3 className="text-base lg:text-lg font-semibold">
            Review your order
        </h3>

        <div className="flex justify-between text-sm">
            <div>
                <p className="font-medium">Products</p>
                <p className="text-slate-400 text-xs">{totalQty} selected</p>
            </div>
            <span>{formatVnd(totalValues)}</span>
        </div>

        {/* <div className="flex justify-between text-sm">
            <div>
                <p className="font-medium">Shipping</p>
                <p className="text-slate-400 text-xs">Plus taxes</p>
            </div>
            <span>$9.99</span>
        </div> */}

        <div className="flex justify-between border-t border-slate-800 pt-4 mt-2 text-sm">
            <p className="font-medium">Total</p>
            <span className="font-semibold">{formatVnd(totalValues)}</span>
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-3 text-sm">
            <h4 className="font-semibold text-sm">
                Shipment details
            </h4>
            <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
            <p className="text-slate-400 text-xs">
                {shippingAddress.addressLine}{shippingAddress.subAddressLine && ", " + shippingAddress.subAddressLine}, {shippingAddress.commune}, {shippingAddress.province}
            </p>
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-2 text-sm">
            <h4 className="font-semibold text-sm">Payment details</h4>
            <p>Payment type: {paymentStatus.method}</p>
            <p>Payment status: {paymentStatus.isPaid ? "PAID" : "NOT PAID YET"} </p>
        </div>
    </div>
}

export default OrderReview