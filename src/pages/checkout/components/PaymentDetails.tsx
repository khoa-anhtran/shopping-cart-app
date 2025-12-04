import { PAYMENT_TYPE } from "@/constants/payment";
import { Tabs, Card, Row, Col, Button, Space, Typography, message, QRCode } from "antd"
import { useDispatch } from "react-redux";
import { paymentStatusUpdated } from "../actions";
import { useSelector } from "react-redux";
import { selectPaymentStatus } from "../selectors";

const { Text } = Typography;

const paymentData = {
    bankName: "Ngân hàng TMCP Quân đội",
    accountName: "TRAN ANH KHOA",
    accountNumber: "VQRQAFRIP5004",
    amount: "1,000 vnd",
    description: "Thanh toán đơn hang",
    exactAmountNote: "1,000",
};

const VietQRPayment: React.FC = () => {
    const copy = (value: string) => {
        navigator.clipboard.writeText(value);
        message.success("Đã sao chép");
    };

    return (
        <Card
            style={{ maxWidth: 900, borderRadius: 12 }}
        >
            {/* Top note + close */}
            <Row justify="space-between" align="middle">
                <Col flex="auto">
                    <Text>
                        Mở App Ngân hàng bất kỳ để{" "}
                        <Text strong>quét mã VietQR</Text> hoặc{" "}
                        <Text strong>chuyển khoản</Text> chính xác số tiền bên dưới
                    </Text>
                </Col>
            </Row>

            <Row gutter={32} align="top" className="py-4">
                {/* Left: QR */}
                <Col xs={24} md={10}>
                    <Card className="flex items-center justify-center">
                        <QRCode
                            value={"00020101021238570010A000000727012700069704220113VQRQAFRIT29880208QRIBFTTA5303704540410005802VN62230819Thanh toan don hang6304C9E0"}
                            size={240}
                        ></QRCode>
                    </Card>

                </Col>

                {/* Right: info */}
                <Col xs={24} md={14}>
                    <Space direction="vertical" size={16} style={{ width: "100%" }}>
                        {/* Bank */}
                        <div>
                            <Text type="secondary">Ngân hàng</Text>
                            <br />
                            <Text strong>{paymentData.bankName}</Text>
                        </div>

                        {/* Account name */}
                        <Row justify="space-between" align="middle">
                            <Col flex="auto">
                                <Text type="secondary">Chủ tài khoản:</Text>
                                <br />
                                <Text strong>{paymentData.accountName}</Text>
                            </Col>
                            <Col>
                                <Button
                                    size="small"
                                    onClick={() => copy(paymentData.accountName)}
                                >
                                    copy
                                </Button>
                            </Col>
                        </Row>

                        {/* Account number */}
                        <Row justify="space-between" align="middle">
                            <Col flex="auto">
                                <Text type="secondary">Số tài khoản:</Text>
                                <br />
                                <Text strong>{paymentData.accountNumber}</Text>
                            </Col>
                            <Col>
                                <Button
                                    size="small"
                                    onClick={() => copy(paymentData.accountNumber)}
                                >
                                    copy
                                </Button>
                            </Col>
                        </Row>

                        {/* Amount */}
                        <Row justify="space-between" align="middle">
                            <Col flex="auto">
                                <Text type="secondary">Số tiền:</Text>
                                <br />
                                <Text strong>{paymentData.amount}</Text>
                            </Col>
                            <Col>
                                <Button size="small" onClick={() => copy(paymentData.amount)}>
                                    copy
                                </Button>
                            </Col>
                        </Row>

                        {/* Description */}
                        <Row justify="space-between" align="middle">
                            <Col flex="auto">
                                <Text type="secondary">Nội dung:</Text>
                                <br />
                                <Text strong>{paymentData.description}</Text>
                            </Col>
                            <Col>
                                <Button
                                    size="small"
                                    onClick={() => copy(paymentData.description)}
                                >
                                    copy
                                </Button>
                            </Col>
                        </Row>

                        <Text>
                            Lưu ý: Nhập chính xác số tiền{" "}
                            <Text strong>{paymentData.exactAmountNote}</Text> khi chuyển khoản
                        </Text>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

const PaymentDetails = () => {
    const dispatch = useDispatch()

    const paymentStatus = useSelector(selectPaymentStatus)

    return <div className="space-y-5">
        <h3 className="text-base lg:text-lg font-semibold">
            Payment details
        </h3>

        <Tabs
            defaultActiveKey={paymentStatus.method}
            onChange={(key) => {
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