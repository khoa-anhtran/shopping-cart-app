import { PAYMENT_TYPE } from "@/constants/payment";
import { Tabs } from "antd"
import { useDispatch } from "react-redux";
import { paymentStatusUpdated } from "../actions";
import { useSelector } from "react-redux";
import { selectPaymentStatus } from "../selectors";
import VietQRPayment from "./VietQRPayment";

const PaymentDetails = () => {
    const dispatch = useDispatch()

    const paymentStatus = useSelector(selectPaymentStatus)

    return <div className="space-y-5">
        <h3 className="text-base lg:text-lg font-semibold">
            Payment details
        </h3>

        <Tabs
            defaultActiveKey={paymentStatus.method}
            onChange={(key: string) => {
                dispatch(paymentStatusUpdated({ isPaid: false, method: key }))
            }}
            items={[
                {
                    key: PAYMENT_TYPE.CASH,
                    label: 'Cash',
                    children: <div className="rounded-xl border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">
                            We will receive cash from you at delivery
                        </p>
                    </div>
                },
                {
                    key: PAYMENT_TYPE.BANK,
                    label: 'Bank Transfer',
                    children: <VietQRPayment />
                }
            ]}>
        </Tabs>
    </div>
}

export default PaymentDetails