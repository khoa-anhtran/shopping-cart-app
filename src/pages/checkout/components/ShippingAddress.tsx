import { Checkbox, Input } from "antd"

const ShippingAddress = () => {
    return <div className="space-y-5">
        <h3 className="text-base lg:text-lg font-semibold">
            Shipping address
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
            <div>
                <label className="block text-xs mb-1">First name</label>
                <Input placeholder="John" className="bg-slate-900" />
            </div>
            <div>
                <label className="block text-xs mb-1">Last name</label>
                <Input placeholder="Snow" className="bg-slate-900" />
            </div>
        </div>

        <div>
            <label className="block text-xs mb-1">
                Address line 1
            </label>
            <Input
                placeholder="Street name and number"
                className="bg-slate-900"
            />
        </div>

        <div>
            <label className="block text-xs mb-1">
                Address line 2
            </label>
            <Input
                placeholder="Apartment, suite, etc. (optional)"
                className="bg-slate-900"
            />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <div>
                <label className="block text-xs mb-1">City</label>
                <Input placeholder="New York" className="bg-slate-900" />
            </div>
            <div>
                <label className="block text-xs mb-1">State</label>
                <Input placeholder="NY" className="bg-slate-900" />
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <div>
                <label className="block text-xs mb-1">
                    Zip / Postal code
                </label>
                <Input placeholder="12345" className="bg-slate-900" />
            </div>
            <div>
                <label className="block text-xs mb-1">Country</label>
                <Input
                    placeholder="United States"
                    className="bg-slate-900"
                />
            </div>
        </div>

        <Checkbox className="text-xs text-slate-300">
            Use this address for payment details
        </Checkbox>
    </div>
}

export default ShippingAddress