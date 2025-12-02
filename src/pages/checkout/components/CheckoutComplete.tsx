import { Button } from "antd"

const CheckoutComplete = () => {
    return <div className="flex flex-col items-center text-center py-12 space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-amber-400/90 flex items-center justify-center text-xl">
            📦
        </div>
        <h3 className="text-xl font-semibold">
            Thank you for your order
        </h3>
        <p className="text-sm text-slate-400 max-w-md">
            Your order number is <span className="font-semibold">#140396</span>.
            We have emailed your order confirmation and will update you once it is shipped.
        </p>
        <Button type="primary" className="mt-2">
            Go to my orders
        </Button>
    </div>
}

export default CheckoutComplete