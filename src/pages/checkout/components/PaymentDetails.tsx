import { Checkbox, Input, Tabs, Card, Row, Col, Button, Space, Tag, Typography, message, Divider, QRCode } from "antd"
import { CopyOutlined } from "@ant-design/icons"
import { useState } from "react"

const { Text } = Typography;

const paymentData = {
    bankName: "Ngân hàng TMCP Quân đội",
    accountName: "TRAN ANH KHOA",
    accountNumber: "VQRQAFRIP5004",
    amount: "1,000 vnd",
    description: "Thanh toán đơn hang",
    exactAmountNote: "1,000",
};

const CreditCardForm = () => (
    <div className="rounded-xl border border-gray-200 p-4 space-y-4">
        <p className="font-medium text-sm">Credit card</p>

        <div>
            <label className="block text-xs mb-1 font-medium">
                Card number
            </label>
            <Input
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className="bg-slate-900"
            />
        </div>

        <Row gutter={16}>
            <Col xs={24} md={16}>
                <label className="block text-xs mb-1 font-medium">Name</label>
                <Input
                    placeholder="John Smith"
                    className="bg-slate-900"
                />
            </Col>
            <Col xs={24} md={8}>
                <label className="block text-xs mb-1 font-medium">
                    Expiration date
                </label>
                <Input placeholder="MM/YY" className="bg-slate-900" />
            </Col>
        </Row>

        <Row gutter={16}>
            <Col xs={24} md={12}>
                <label className="block text-xs mb-1 font-medium">CVV</label>
                <Input placeholder="123" maxLength={3} className="bg-slate-900" />
            </Col>
        </Row>

        <Checkbox className="text-xs text-slate-300">
            Remember credit card details for next time
        </Checkbox>
    </div>
)

const BankTransferInfo = () => {
    const [copied, setCopied] = useState(false)

    const bankDetails = {
        bank: "Ngân hàng TMCP Quân đội",
        accountHolder: "TRAN ANH KHOA",
        accountNumber: "VQRQAFRIP5004",
        amount: "1,000 vnd",
        description: "Thanh toán đơn hàng"
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-4">
            <Card className="border-gray-200">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <p className="text-xs text-gray-500 mb-2">Ngân hàng</p>
                        <p className="text-sm font-semibold">{bankDetails.bank}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-2">Chủ tài khoản</p>
                        <p className="text-sm font-semibold">{bankDetails.accountHolder}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-2">Số tài khoản</p>
                        <div className="flex items-center gap-2">
                            <code className="bg-slate-900 px-3 py-2 rounded text-sm font-mono">
                                {bankDetails.accountNumber}
                            </code>
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => handleCopy(bankDetails.accountNumber)}
                            >
                                {copied ? "Copied" : "Copy"}
                            </Button>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-2">Số tiền</p>
                        <div className="flex items-center gap-2">
                            <code className="bg-slate-900 px-3 py-2 rounded text-sm font-mono">
                                {bankDetails.amount}
                            </code>
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => handleCopy(bankDetails.amount)}
                            >
                                Copy
                            </Button>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-2">Nội dung</p>
                        <p className="text-sm font-semibold">{bankDetails.description}</p>
                    </div>

                    <Tag color="cyan">
                        Lưu ý: Nhập chính xác số tiền 1,000 khi chuyển khoản
                    </Tag>
                </Space>
            </Card>
        </div>
    )
}

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
                                    Sao chép
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
                                    Sao chép
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
                                    Sao chép
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
                                    Sao chép
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
    return <div className="space-y-5">
        <h3 className="text-base lg:text-lg font-semibold">
            Payment details
        </h3>

        <Tabs defaultActiveKey="cash" items={[
            {
                key: 'cash',
                label: 'Cash',
                children: <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">
                        We will receive cash from you at delivery
                    </p>
                </div>
            },
            {
                key: 'credit-card',
                label: 'Credit Card',
                children: <CreditCardForm />
            },
            {
                key: 'bank-transfer',
                label: 'Bank Transfer',
                children: <VietQRPayment />
            }
        ]}>
        </Tabs>
    </div>
}

export default PaymentDetails