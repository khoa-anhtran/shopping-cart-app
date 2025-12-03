export type Order = {
    shippingAddress: ShippingAddressType,
    paymentInfo: PaymentInfo,
    items: CartItem,
    total: number
}