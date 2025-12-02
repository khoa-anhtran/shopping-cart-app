import { Checkbox, Input, Tabs } from "antd"
import TabPane from "antd/es/tabs/TabPane"

const PaymentDetails = () => {
    return <div className="space-y-5">
        <h3 className="text-base lg:text-lg font-semibold">
            Payment details
        </h3>

        <Tabs defaultActiveKey="card">
            <TabPane tab="Card" key="card" />
            <TabPane tab="Bank account" key="bank" />
        </Tabs>

        <div className="rounded-xl border border-gray-200 p-4 space-y-4">
            <p className="font-medium text-sm">Credit card</p>

            <div>
                <label className="block text-xs mb-1">
                    Card number
                </label>
                <Input
                    placeholder="0000 0000 0000 0000"
                    className="bg-slate-900"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                <div>
                    <label className="block text-xs mb-1">Name</label>
                    <Input
                        placeholder="John Smith"
                        className="bg-slate-900"
                    />
                </div>
                <div>
                    <label className="block text-xs mb-1">
                        Expiration date
                    </label>
                    <Input placeholder="MM/YY" className="bg-slate-900" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                <div>
                    <label className="block text-xs mb-1">CVV</label>
                    <Input placeholder="123" className="bg-slate-900" />
                </div>
            </div>

            <Checkbox className="text-xs text-slate-300">
                Remember credit card details for next time
            </Checkbox>
        </div>
    </div>
}

export default PaymentDetails